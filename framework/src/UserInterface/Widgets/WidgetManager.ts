import { WidgetMetadata, Widget } from "./index.js";
import { InvalidOperationException, ArgumentTypeException } from "../../Standard/index.js";
import { ObjectUtils, DeepClone } from "../../CoreBase/Utils/index.js";
import { Type } from "../../Standard/Types/index.js";
import { Collection, Dictionary } from "../../Standard/Collections/index.js";

const registeredWidgets: Collection<WidgetMetadata> = new Collection();

const activeInstances: Dictionary<WidgetMetadata, Collection<Widget>> = new Dictionary();

function getRegisteredWidgetByName(qualifiedName: string, namespaceURI: string): WidgetMetadata | undefined {
    return registeredWidgets.find(m => m.namespaceURI === namespaceURI && m.qualifiedName === qualifiedName);
}

function getRegisteredWidgetByConstructor(widgetConstructor: new () => Widget): WidgetMetadata | undefined {
    return registeredWidgets.find(m => m.WidgetClass === widgetConstructor);
}

function registerWidget(metadata: WidgetMetadata) {
    registeredWidgets.add(metadata);
    activeInstances.set(metadata, new Collection());
}

function initializeWidgetInstance(metadata: WidgetMetadata, node: Node): void {
    const WidgetClass: new () => Widget = metadata.WidgetClass;
    const widgetInstance: Widget = new WidgetClass();

    const activeWidgetInstances = activeInstances.get(metadata);
    if (!activeWidgetInstances)
        return;

    activeWidgetInstances.add(widgetInstance);
}

function initializeWidgetInstanceByNode(node: Node) {
    const metadata = getRegisteredWidgetByName(node.nodeName, <string>node.namespaceURI);
    if (!metadata)
        return;

    initializeWidgetInstance(metadata, node);
}

function finalizeWidgetInstance(metadata: WidgetMetadata, instance: Widget): void {
    instance.destruct();

    const activeWidgetInstances = activeInstances.get(metadata);
    if (!activeWidgetInstances)
        return;

    activeWidgetInstances.remove(instance);
}

function finalizeWidgetInstanceByNode(node: Node) {
    const metadata = getRegisteredWidgetByName(node.nodeName, <string>node.namespaceURI);
    if (!metadata)
        return;

    finalizeWidgetInstance(metadata, node);
}

function finalizeWidgetIntances(metadata: WidgetMetadata, instances: Iterable<Widget>) {
    for (let instance of instances)
        finalizeWidgetInstance(metadata, instance);
}

function unregisterWidget(metadata: WidgetMetadata, force: boolean = false) {
    if (activeInstances.has(metadata)) {
        if (force)
            finalizeWidgetIntances(metadata, activeInstances.get(metadata));
        else
            return false;
    }

    activeInstances.delete(metadata);
    return true;
}

const WidgetManager = {
    get registeredWidgets(): DeepClone<WidgetMetadata[]> {
        return ObjectUtils.getDeepClone([...registeredWidgets]);
    },

    getByName(qualifiedName: string, namespaceURI?: string) {
        if (namespaceURI !== undefined && typeof namespaceURI != "string")
            throw new ArgumentTypeException("namespaceURI", namespaceURI, String);
        if (typeof qualifiedName != "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        return getRegisteredWidgetByName(namespaceURI, qualifiedName);
    },

    getByConstructor(widgetConstructor: new () => Widget) {
        if (!Type.get(widgetConstructor).extends(Type.get(Function)))
            throw new ArgumentTypeException("widgetConstructor", widgetConstructor, Widget);

        return getRegisteredWidgetByConstructor(widgetConstructor);
    },

    register(widgetConstructor: new () => Widget, namespaceURI: string, qualifiedName: string): void {
        if (!Type.get(widgetConstructor).extends(Type.get(Function)))
            throw new ArgumentTypeException("widgetConstructor", widgetConstructor, Widget);

        if (getRegisteredWidgetByConstructor(widgetConstructor) !== undefined)
            throw new InvalidOperationException("Cannot register widget. The specified widget constructor is already in use.");

        const metadata: WidgetMetadata = new WidgetMetadata(widgetConstructor, namespaceURI, qualifiedName);
        registerWidget(metadata);
    },

    deregister(widgetConstructor: new () => Widget): void {
        if (!Type.get(widgetConstructor).extends(Type.get(Function)))
            throw new ArgumentTypeException("widgetConstructor", widgetConstructor, Widget);

        const metadata: WidgetMetadata = getRegisteredWidgetByConstructor(widgetConstructor);
        if (metadata === undefined)
            throw new InvalidOperationException("Cannot deregister widget. No registered widget matches the specified widget constructor.");

        registeredWidgets.remove(metadata);
    }
};
export default WidgetManager;

function domMutated_handler(mutations: MutationRecord[]) {
    for (let mutation of mutations) {
        if (mutation.type == "childList") {
            for (let addedNode of mutation.addedNodes)
                initializeWidgetInstanceByNode(addedNode);

            for (let removedNode of mutation.removedNodes)
                finalizeWidgetInstanceByNode(removedNode);
        }
    }
}
const domMutationObserver = new MutationObserver(domMutated_handler);

function observeDOM() {
    domMutationObserver.observe(document, { childList: true, subtree: true, });
}

function deobserveDOM() {
    window.removeEventListener("beforeunload", window_beforeUnload_handler);
}

function window_load_handler() {
    observeDOM();
}
window.addEventListener("load", window_load_handler);

function window_beforeUnload_handler() {
    deobserveDOM();
}
window.addEventListener("beforeunload", window_beforeUnload_handler);