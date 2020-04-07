﻿import { InvalidOperationException, ArgumentTypeException } from "../../Standard/index.js";
import { Type, Class, Instance } from "../../Standard/Types/index.js";
import { Collection } from "../../Standard/Collections/index.js";
import { DOMUtils } from "../index.js";
import { ControlMetadata } from "./ControlMetadata.js";
import { Control } from "./Control.js";
import { assertParams } from "../../Validation/index.js";

type ControlConstructor<TControl extends Control> = new (qualifiedName: string, namespaceURI: string | null) => TControl;

const registeredControls: Collection<ControlMetadata> = new Collection();

function getRegisteredControlByName(qualifiedName: string, namespaceURI?: string | null): ControlMetadata | null {
    return registeredControls.find(m => m.namespaceURI === namespaceURI && m.qualifiedName === qualifiedName) || null;
}

function getRegisteredControlByConstructor<TControl extends Control>(controlConstructor: Class<Control>): ControlMetadata<TControl> | null {
    return registeredControls.find(m => m.controlClass === controlConstructor) || null;
}

function registerControl(metadata: ControlMetadata) {
    registeredControls.add(metadata);
    fullUpdate();
}

function initializeControlInstance<TControl extends Control>(metadata: ControlMetadata, element: Element): TControl {
    const controlClass: Class<Control> = metadata.controlClass;
    const controlInstance = new (<ControlConstructor<TControl>>controlClass)(metadata.qualifiedName, metadata.namespaceURI);
    controlInstance.initialize(element);
    metadata.activeInstances.add(controlInstance);
    return controlInstance;
}

function initializeControlInstanceByElement(element: Element) {
    const metadata = getRegisteredControlByName(element.nodeName, <string>element.namespaceURI);
    if (metadata) {
        if (getControlInstanceByElement(<ControlMetadata>metadata, element))
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
    return metadata.activeInstances.find(m => m.domElement === element) || null;
}

function finalizeControlInstanceByElement(element: Element) {
    const metadata = getRegisteredControlByName(element.nodeName, <string>element.namespaceURI);
    if (metadata) {
        const instance = getControlInstanceByElement(<ControlMetadata>metadata, element);
        if (instance) {
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
    if (metadata.activeInstances.length > 0) {
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

export function getByName(qualifiedName: string, namespaceURI: string | null = null) {
    assertParams({ qualifiedName }, [String]);
    assertParams({ namespaceURI }, [String, null]);

    return getRegisteredControlByName(qualifiedName, namespaceURI);
}

function assertControlConstructor(controlConstructor: Class<Control>) {
    if (!Type.get(controlConstructor).extends(Type.get(Control)))
        throw new ArgumentTypeException("controlConstructor", controlConstructor, Control);
}

export function getByConstructor(controlConstructor: Class<Control>) {
    assertParams({ controlConstructor }, [Function]);
    assertControlConstructor(controlConstructor);

    return getRegisteredControlByConstructor(controlConstructor);
}

export function register(controlConstructor: Class<Control>, qualifiedName: string, namespaceURI: string | null = null): void {
    assertParams({ controlConstructor }, [Function]);
    assertParams({ qualifiedName }, [String]);
    assertParams({ namespaceURI }, [String, null]);
    assertControlConstructor(controlConstructor);

    if (getRegisteredControlByConstructor(controlConstructor))
        throw new InvalidOperationException("Cannot register control. The specified control constructor is already in use.");
    else {
        if (getRegisteredControlByName(qualifiedName, namespaceURI))
            throw new InvalidOperationException("Cannot register control. The specified control name and namespace URI are already in use.");
        else {
            const metadata: ControlMetadata = new ControlMetadata(controlConstructor, qualifiedName, namespaceURI);
            registerControl(metadata);
        }
    }
}

export function deregister(controlConstructor: Class<Control>): void {
    assertParams({ controlConstructor }, [Function]);
    assertControlConstructor(controlConstructor);

    const metadata = getRegisteredControlByConstructor(controlConstructor);
    if (metadata)
        deregisterControl(<ControlMetadata>metadata);
    else
        throw new InvalidOperationException("Cannot deregister control. No registered control matches the specified control constructor.");
}

export function instantiate<TControl extends Control>(controlClass: Class<TControl>): TControl {
    assertParams({ controlClass }, [Function]);
    assertControlConstructor(controlClass);

    const metadata = getRegisteredControlByConstructor(controlClass);
    if (metadata) {
        const element = DOMUtils.createElement((<ControlMetadata>metadata).qualifiedName, (<ControlMetadata>metadata).namespaceURI);
        return <TControl>initializeControlInstance(<ControlMetadata>metadata, element);
    }
    else
        throw new InvalidOperationException("Cannot instantiate control. No registered control matches the specified control constructor.");
}

function fullUpdate(startElem?: Element) {
    startElem = startElem || document.body;
    for (let child of startElem.children) {
        initializeControlInstanceByElement(child);

        fullUpdate(child);
    }
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
    fullUpdate();
    observeDOM();
}
window.addEventListener("load", window_load_handler);

function window_beforeUnload_handler() {
    deobserveDOM();
}
window.addEventListener("beforeunload", window_beforeUnload_handler);