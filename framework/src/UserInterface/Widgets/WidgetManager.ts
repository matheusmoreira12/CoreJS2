import { WidgetMetadata, Widget } from "./index";
import { InvalidOperationException, ArgumentTypeException } from "../../Standard/index";
import { Type, Class } from "../../Standard/Types/index";
import { Collection } from "../../Standard/Collections/index";

const registeredWidgets: Collection<WidgetMetadata> = new Collection();

function getRegisteredWidgetByName(qualifiedName: string, namespaceURI?: string | null): WidgetMetadata | null {
    return registeredWidgets.find(m => m.namespaceURI === namespaceURI && m.qualifiedName === qualifiedName) || null;
}

function getRegisteredWidgetByConstructor(widgetConstructor: Class<Widget>): WidgetMetadata | null {
    return registeredWidgets.find(m => m.widgetConstructor === widgetConstructor) || null;
}

function registerWidget(metadata: WidgetMetadata) {
    registeredWidgets.add(metadata);
}

function initializeWidgetInstance(metadata: WidgetMetadata, element: Element): void {
    const widgetConstructor: Class<Widget> = metadata.widgetConstructor;
    const widgetInstance: Widget = new widgetConstructor(element);
    metadata.activeInstances.add(widgetInstance);
}

function initializeWidgetInstanceByElement(element: Element) {
    const metadata = getRegisteredWidgetByName(element.nodeName, <string>element.namespaceURI);
    if (!metadata)
        return;

    initializeWidgetInstance(metadata, element);
}

function finalizeWidgetInstance(metadata: WidgetMetadata, instance: Widget): void {
    instance.destruct();
    metadata.activeInstances.remove(instance);
}

function getWidgetInstanceByElement(metadata: WidgetMetadata, element: Element): Widget | null {
    return metadata.activeInstances.find(m => m.domNode === element) || null;
}

function finalizeWidgetInstanceByElement(element: Element) {
    const metadata = getRegisteredWidgetByName(element.nodeName, <string>element.namespaceURI);
    if (!metadata)
        return false;

    const instance = getWidgetInstanceByElement(metadata, element);
    if (!instance)
        return false;

    finalizeWidgetInstance(metadata, instance);
    return true;
}

function unregisterWidget(metadata: WidgetMetadata, forceFinalization: boolean = false) {
    if (metadata.activeInstances.length > 0) {
        if (!forceFinalization)
            return false;

        for (let instance of metadata.activeInstances)
            finalizeWidgetInstance(metadata, instance);
    }

    registeredWidgets.remove(metadata);
    return true;
}

export function getRegisteredWidgets(): WidgetMetadata[] {
    return [...registeredWidgets];
}

export function getByName(qualifiedName: string, namespaceURI?: string | null) {
    if (namespaceURI !== undefined && typeof namespaceURI != "string")
        throw new ArgumentTypeException("namespaceURI", namespaceURI, String);
    if (typeof qualifiedName != "string")
        throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

    return getRegisteredWidgetByName(qualifiedName, namespaceURI);
}

export function getByConstructor(widgetConstructor: Class<Widget>) {
    if (!Type.get(widgetConstructor).extends(Type.get(Function)))
        throw new ArgumentTypeException("widgetConstructor", widgetConstructor, Widget);

    return getRegisteredWidgetByConstructor(widgetConstructor);
}

export function register(widgetConstructor: Class<Widget>, qualifiedName: string, namespaceURI?: string | null): void {
    if (!Type.get(widgetConstructor).extends(Type.get(Function)))
        throw new ArgumentTypeException("widgetConstructor", widgetConstructor, Widget);

    if (getRegisteredWidgetByConstructor(widgetConstructor) !== undefined)
        throw new InvalidOperationException("Cannot register widget. The specified widget constructor is already in use.");

    const metadata: WidgetMetadata = new WidgetMetadata(widgetConstructor, qualifiedName, namespaceURI);
    registerWidget(metadata);
}

export function deregister(widgetConstructor: Class<Widget>): void {
    if (!Type.get(widgetConstructor).extends(Type.get(Function)))
        throw new ArgumentTypeException("widgetConstructor", widgetConstructor, Widget);

    const metadata: WidgetMetadata | null = getRegisteredWidgetByConstructor(widgetConstructor);
    if (!metadata)
        throw new InvalidOperationException("Cannot deregister widget. No registered widget matches the specified widget constructor.");

    registeredWidgets.remove(metadata);
}

function domMutated_handler(mutations: MutationRecord[]) {
    for (let mutation of mutations) {
        if (mutation.type == "childList") {
            for (let addedNode of mutation.addedNodes)
                initializeWidgetInstanceByElement(<Element>addedNode);

            for (let removedNode of mutation.removedNodes)
                finalizeWidgetInstanceByElement(<Element>removedNode);
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