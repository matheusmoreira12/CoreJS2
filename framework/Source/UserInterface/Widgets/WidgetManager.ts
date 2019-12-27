import { Collection } from "../../Standard/Collections";
import { WidgetMetadata } from "./WidgetMetadata";
import { Widget } from "./Widget";
import { InvalidOperationException, ArgumentTypeException } from "../../Standard/Exceptions";
import { ObjectUtils, DeepReadonly, DeepClone } from "../../CoreBase/ObjectUtils";
import { Type } from "../../Standard/Types/Types";

const registeredWidgets: Collection<WidgetMetadata> = new Collection();

function getRegisteredWidgetByName(namespaceURI: string, qualifiedName: string): WidgetMetadata {
    return registeredWidgets.find(m => m.namespaceURI === namespaceURI || m.qualifiedName === qualifiedName);
}

function getRegisteredWidgetByConstructor(widgetConstructor: new () => Widget): WidgetMetadata {
    return registeredWidgets.find(m => m.WidgetClass === widgetConstructor);
}

function activateWidget(widget: WidgetMetadata, node: Node): void {
    const WidgetClass = widget.WidgetClass;
    const widgetInstance = new WidgetClass();
    Object.setPrototypeOf(widgetInstance, node);

    widget.__activeInstances.add(widgetInstance);
}

function deactivateWidget(widget: WidgetMetadata, node: Node) {

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
        registeredWidgets.add(metadata);
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