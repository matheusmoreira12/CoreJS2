import { InvalidOperationException, ArgumentTypeException } from "../../Standard/index";
import { Type, Class } from "../../Standard/Types/index";
import { Collection } from "../../Standard/Collections/index";
import { DOMUtils } from "../index";
import { ControlMetadata } from "./ControlMetadata";
import { Control } from "./Control";
import { assertParams } from "../../Validation/index";

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
    const isControlRegistered = !!metadata;
    if (isControlRegistered) {
        const isInstanceActive = !!getControlInstanceByElement(<ControlMetadata>metadata, element);
        if (isInstanceActive)
            return false;
        else {
            initializeControlInstance(<ControlMetadata>metadata, element);
            return true;
        }
    }
    else
        return false;
}

function finalizeControlInstance(metadata: ControlMetadata, instance: Control): void {
    if (!instance.isDestructed)
        instance.destruct();

    metadata.activeInstances.remove(instance);
}

function getControlInstanceByElement(metadata: ControlMetadata, element: Element): Control | null {
    return metadata.activeInstances.find(m => m.domNode === element) || null;
}

function finalizeControlInstanceByElement(element: Element) {
    const metadata = getRegisteredControlByName(element.nodeName, <string>element.namespaceURI);
    const isControlRegistered = !!metadata;
    if (isControlRegistered) {
        const instance = getControlInstanceByElement(<ControlMetadata>metadata, element);
        const isInstanceActive = !!instance;
        if (isInstanceActive) {
            finalizeControlInstance(<ControlMetadata>metadata, <Control>instance);
            return true;
        }
        else
            return false;
    }
    else
        return false;
}

function deregisterControl(metadata: ControlMetadata, forceFinalization: boolean = false) {
    const hasActiveInstances = metadata.activeInstances.length > 0;
    if (hasActiveInstances) {
        if (forceFinalization) {
            for (let instance of metadata.activeInstances)
                finalizeControlInstance(metadata, instance);
        }
        else
            return false;
    }

    registeredControls.remove(metadata);
    return true;
}

export function getRegisteredControls(): ControlMetadata[] {
    return [...registeredControls];
}

export function getByName(qualifiedName: string, namespaceURI: string | null = null) {
    assertParams({ qualifiedName }, String);
    assertParams({ namespaceURI }, String, null);

    return getRegisteredControlByName(qualifiedName, namespaceURI);
}

function assertControlConstructor(controlConstructor: Class<Control>) {
    if (!Type.get(controlConstructor).extends(Type.get(<any>Control)))
        throw new ArgumentTypeException("controlConstructor", controlConstructor, Control);
}

export function getByConstructor(controlConstructor: Class<Control>) {
    assertParams({ controlConstructor }, Function);
    assertControlConstructor(controlConstructor);

    return getRegisteredControlByConstructor(controlConstructor);
}

export function register(controlConstructor: Class<Control>, qualifiedName: string, namespaceURI: string | null = null): void {
    assertParams({ controlConstructor }, Function);
    assertParams({ qualifiedName }, String);
    assertParams({ namespaceURI }, String, null);
    assertControlConstructor(controlConstructor);

    const isControlAlreadyRegistered = !!getRegisteredControlByConstructor(controlConstructor);
    if (isControlAlreadyRegistered)
        throw new InvalidOperationException("Cannot register control. The specified control constructor is already in use.");
    else {
        const isControlNameAlreadyInUse = !!getRegisteredControlByName(qualifiedName, namespaceURI);
        if (isControlNameAlreadyInUse)
            throw new InvalidOperationException("Cannot register control. The specified control name and namespace URI are already in use.");
        else {
            const metadata: ControlMetadata = new ControlMetadata(controlConstructor, qualifiedName, namespaceURI);
            registerControl(metadata);
        }
    }
}

export function deregister(controlConstructor: Class<Control>): void {
    assertParams({ controlConstructor }, Function);
    assertControlConstructor(controlConstructor);

    const metadata: ControlMetadata | null = getRegisteredControlByConstructor(controlConstructor);
    const isControlRegistered = !!metadata;
    if (isControlRegistered)
        deregisterControl(<ControlMetadata>metadata);
    else
        throw new InvalidOperationException("Cannot deregister control. No registered control matches the specified control constructor.");
}

export function instantiate<TControl extends Control>(controlConstructor: Class<Control>): TControl {
    assertParams({ controlConstructor }, Function);
    assertControlConstructor(controlConstructor);

    const metadata: ControlMetadata | null = getRegisteredControlByConstructor(controlConstructor);
    const isControlRegistered = !!metadata;
    if (isControlRegistered) {
        const element = DOMUtils.createElement((<ControlMetadata>metadata).qualifiedName, (<ControlMetadata>metadata).namespaceURI);
        return <TControl>initializeControlInstance(<ControlMetadata>metadata, element);
    }
    else
        throw new InvalidOperationException("Cannot instantiate control. No registered control matches the specified control constructor.");
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