import { Collection } from "../../Standard/Collections";
import { WidgetMetadata } from "./WidgetMetadata";
import { Widget } from "./Widget";
import { InvalidOperationException, ArgumentTypeException } from "../../Standard/Exceptions";
import { ObjectUtils } from "../../CoreBase/ObjectUtils";
import { Type } from "../../Standard/Types/Types";
const registeredWidgets = new Collection();
function getRegisteredWidgetByName(namespaceURI, qualifiedName) {
    return registeredWidgets.find(m => m.namespaceURI === namespaceURI || m.qualifiedName === qualifiedName);
}
function getRegisteredWidgetByConstructor(widgetConstructor) {
    return registeredWidgets.find(m => m.WidgetClass === widgetConstructor);
}
function activateWidget(widget, node) {
    const WidgetClass = widget.WidgetClass;
    const widgetInstance = new WidgetClass();
    Object.setPrototypeOf(widgetInstance, node);
    widget.__activeInstances.add(widgetInstance);
}
function deactivateWidget(widget, node) {
}
const WidgetManager = {
    get registeredWidgets() {
        return ObjectUtils.getDeepClone([...registeredWidgets]);
    },
    getByName(qualifiedName, namespaceURI) {
        if (namespaceURI !== undefined && typeof namespaceURI != "string")
            throw new ArgumentTypeException("namespaceURI", namespaceURI, String);
        if (typeof qualifiedName != "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);
        return getRegisteredWidgetByName(namespaceURI, qualifiedName);
    },
    getByConstructor(widgetConstructor) {
        if (!Type.get(widgetConstructor).extends(Type.get(Function)))
            throw new ArgumentTypeException("widgetConstructor", widgetConstructor, Widget);
        return getRegisteredWidgetByConstructor(widgetConstructor);
    },
    register(widgetConstructor, namespaceURI, qualifiedName) {
        if (!Type.get(widgetConstructor).extends(Type.get(Function)))
            throw new ArgumentTypeException("widgetConstructor", widgetConstructor, Widget);
        if (getRegisteredWidgetByConstructor(widgetConstructor) !== undefined)
            throw new InvalidOperationException("Cannot register widget. The specified widget constructor is already in use.");
        const metadata = new WidgetMetadata(widgetConstructor, namespaceURI, qualifiedName);
        registeredWidgets.add(metadata);
    },
    deregister(widgetConstructor) {
        if (!Type.get(widgetConstructor).extends(Type.get(Function)))
            throw new ArgumentTypeException("widgetConstructor", widgetConstructor, Widget);
        const metadata = getRegisteredWidgetByConstructor(widgetConstructor);
        if (metadata === undefined)
            throw new InvalidOperationException("Cannot deregister widget. No registered widget matches the specified widget constructor.");
        registeredWidgets.remove(metadata);
    }
};
export default WidgetManager;
function domMutated_handler(mutations) {
    for (let mutation of mutations) {
        if (mutation.type == "childList") {
            for (let addedNode of mutation.addedNodes) {
                const widget = getRegisteredWidgetByName(addedNode.namespaceURI, addedNode.nodeName);
                activateWidget(widget, addedNode);
            }
            for (let removedNode of mutation.removedNodes) {
                const widget = getRegisteredWidgetByName(removedNode.namespaceURI, removedNode.nodeName);
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
