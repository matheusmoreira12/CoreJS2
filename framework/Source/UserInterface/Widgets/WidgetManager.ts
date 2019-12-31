import { Collection, Dictionary } from "../../Standard/Collections.js";
import { WidgetMetadata } from "./WidgetMetadata.js";
import { Widget } from "./Widget.js";
import { InvalidOperationException, ArgumentTypeException } from "../../Standard/Exceptions.js";
import ObjectUtils, { DeepClone } from "../../CoreBase/Utils/ObjectUtils.js";
import { Type } from "../../Standard/Types/Types.js";

const registeredWidgets: Collection<WidgetMetadata> = new Collection();

const activeInstances: Dictionary<WidgetMetadata, Collection<Widget>> = new Dictionary();

function getRegisteredWidgetByName(namespaceURI: string, qualifiedName: string): WidgetMetadata | undefined {
    return registeredWidgets.find(m => m.namespaceURI === namespaceURI || m.qualifiedName === qualifiedName);
}

function getRegisteredWidgetByConstructor(widgetConstructor: new () => Widget): WidgetMetadata | undefined {
    return registeredWidgets.find(m => m.WidgetClass === widgetConstructor);
}

function registerWidget(metadata: WidgetMetadata) {
    registeredWidgets.add(metadata);
    activeInstances.set(metadata, new Collection());
}

function initializeWidgetInstance(metadata: WidgetMetadata): boolean {
    const activeWidgetInstances: Collection<Widget> = activeInstances.get(metadata);
    if (activeWidgetInstances === undefined)
        return false;

    const WidgetClass: new () => Widget = metadata.WidgetClass;
    const widgetInstance: Widget = new WidgetClass();

    activeWidgetInstances.add(widgetInstance);
    return true;
}

function terminateWidgetInstance(instance: Widget) {

}

function terminateWidgetIntances(instances: Iterable<Widget>) {

}

function unregisterWidget(metadata: WidgetMetadata, force: boolean = false) {
    if (activeInstances.has(metadata)) {
        if (force)
            terminateWidgetIntances(activeInstances.get(metadata));
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
            for (let addedNode of mutation.addedNodes) {
                const widget: WidgetMetadata = getRegisteredWidgetByName(addedNode.namespaceURI, addedNode.nodeName);
                activateWidget(widget, addedNode);
            }
            for (let removedNode of mutation.removedNodes) {
                const widget: WidgetMetadata = getRegisteredWidgetByName(removedNode.namespaceURI, removedNode.nodeName);
                deactivateWidget(widget, removedNode);
            }
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