import { Dictionary } from "../../Standard/Collections";
import { WidgetMetadata } from "./WidgetMetadata";
import { InvalidOperationException } from "../../Standard/Exceptions";
const registeredWidgets = new Dictionary();
const WidgetManager = {
    get registeredWidgets() {
        return registeredWidgets.getValues();
    },
    register(widgetConstructor, namespaceURI, qualifiedName) {
        if (registeredWidgets.has(widgetConstructor))
            throw new InvalidOperationException("Cannot register widget. The specified widget constructor is already in use.");
        const metadata = new WidgetMetadata(widgetConstructor, namespaceURI, qualifiedName);
        registeredWidgets.set(widgetConstructor, metadata);
    },
    deregister(widgetConstructor) {
        if (!registeredWidgets.has(widgetConstructor))
            throw new InvalidOperationException("Cannot deregister widget. No registered widget matches the specified widget constructor.");
        registeredWidgets.delete(widgetConstructor);
    }
};
export default WidgetManager;
function domMutated_handler(mutations) {
    for (let mutation of mutations) {
        for (let addedNode of mutation.addedNodes)
            ;
    }
}
const domMutationObserver = new MutationObserver(domMutated_handler);
function observeDOM() {
    domMutationObserver.observe(document, { childList: true, subtree: true });
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
