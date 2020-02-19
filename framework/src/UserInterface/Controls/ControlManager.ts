import { InvalidOperationException, ArgumentTypeException } from "../../Standard/index";
import { Type, Class } from "../../Standard/Types/index";
import { Collection } from "../../Standard/Collections/index";
import { DOMUtils } from "../index";
import { ControlMetadata } from "./ControlMetadata";
import { Control } from "./Control";

const registeredControls: Collection<ControlMetadata> = new Collection();

function getRegisteredControlByName(qualifiedName: string, namespaceURI?: string | null): ControlMetadata | null {
    return registeredControls.find(m => m.namespaceURI === namespaceURI && m.qualifiedName === qualifiedName) || null;
}

function getRegisteredControlByConstructor(controlConstructor: Class<Control>): ControlMetadata | null {
    return registeredControls.find(m => m.controlConstructor === controlConstructor) || null;
}

function registerControl(metadata: ControlMetadata) {
    registeredControls.add(metadata);
}

function initializeControlInstance(metadata: ControlMetadata, element: Element): Control {
    const controlConstructor: Class<Control> = metadata.controlConstructor;
    const controlInstance: Control = new controlConstructor(element);

    metadata.activeInstances.add(controlInstance);

    return controlInstance;
}

function initializeControlInstanceByElement(element: Element) {
    const metadata = getRegisteredControlByName(element.nodeName, <string>element.namespaceURI);
    if (!metadata)
        return false;

    initializeControlInstance(metadata, element);
    return true;
}

function finalizeControlInstance(metadata: ControlMetadata, instance: Control): void {
    if(!instance.isDestructed)
        instance.destruct();
        
    metadata.activeInstances.remove(instance);
}

function getControlInstanceByElement(metadata: ControlMetadata, element: Element): Control | null {
    return metadata.activeInstances.find(m => m.domNode === element) || null;
}

function finalizeControlInstanceByElement(element: Element) {
    const metadata = getRegisteredControlByName(element.nodeName, <string>element.namespaceURI);
    if (!metadata)
        return false;

    const instance = getControlInstanceByElement(metadata, element);
    if (!instance)
        return false;

    finalizeControlInstance(metadata, instance);
    return true;
}

function deregisterControl(metadata: ControlMetadata, forceFinalization: boolean = false) {
    if (metadata.activeInstances.length > 0) {
        if (!forceFinalization)
            return false;

        for (let instance of metadata.activeInstances)
            finalizeControlInstance(metadata, instance);
    }

    registeredControls.remove(metadata);
    return true;
}

export function getRegisteredControls(): ControlMetadata[] {
    return [...registeredControls];
}

export function getByName(qualifiedName: string, namespaceURI: string | null = null) {
    if (namespaceURI !== undefined && typeof namespaceURI != "string")
        throw new ArgumentTypeException("namespaceURI", namespaceURI, String);
    if (typeof qualifiedName != "string")
        throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

    return getRegisteredControlByName(qualifiedName, namespaceURI);
}

function assertControlConstructor(controlConstructor: Class<Control>) {
    if (!Type.get(controlConstructor).extends(Type.get(<any>Control)))
        throw new ArgumentTypeException("controlConstructor", controlConstructor, Control);
}

export function getByConstructor(controlConstructor: Class<Control>) {
    assertControlConstructor(controlConstructor);

    return getRegisteredControlByConstructor(controlConstructor);
}

export function register(controlConstructor: Class<Control>, qualifiedName: string, namespaceURI: string | null = null): void {
    assertControlConstructor(controlConstructor);

    if (getRegisteredControlByConstructor(controlConstructor))
        throw new InvalidOperationException("Cannot register control. The specified control constructor is already in use.");

    const metadata: ControlMetadata = new ControlMetadata(controlConstructor, qualifiedName, namespaceURI);
    registerControl(metadata);
}

export function deregister(controlConstructor: Class<Control>): void {
    assertControlConstructor(controlConstructor);

    const metadata: ControlMetadata | null = getRegisteredControlByConstructor(controlConstructor);
    if (!metadata)
        throw new InvalidOperationException("Cannot deregister control. No registered control matches the specified control constructor.");

    deregisterControl(metadata);
}

export function instantiate(controlConstructor: Class<Control>) {
    assertControlConstructor(controlConstructor);

    const metadata: ControlMetadata | null = getRegisteredControlByConstructor(controlConstructor);
    if (!metadata)
        throw new InvalidOperationException("Cannot instantiate control. No registered control matches the specified control constructor.");

    const element = DOMUtils.createElement(metadata.qualifiedName, metadata.namespaceURI);
    return initializeControlInstance(metadata, element);
}

function domMutated_handler(mutations: MutationRecord[]) {
    for (let mutation of mutations) {
        if (mutation.type == "childList") {
            for (let addedNode of mutation.addedNodes)
                initializeControlInstanceByElement(<Element>addedNode);

            for (let removedNode of mutation.removedNodes)
                finalizeControlInstanceByElement(<Element>removedNode);
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