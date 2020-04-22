import { InvalidOperationException, ArgumentTypeException } from "../../Standard/index.js";
import { Type, Class } from "../../Standard/Types/index.js";
import { Collection } from "../../Standard/Collections/index.js";
import { ControlMetadata } from "./ControlMetadata.js";
import { Control } from "./Control.js";
import { assertParams } from "../../Validation/index.js";
import { DeferredTask } from "../../Standard/Timing/index.js";
import { StringUtils } from "../../CoreBase/Utils/index.js";
import { NodeName } from "../Markup/NodeName.js";

type ControlConstructor<TControl extends Control> = new (name: string) => TControl;

const registeredControls: Collection<ControlMetadata> = new Collection();

function convertNodeNameToDOMNodeName(name: NodeName) {
    return `${name.prefix}-${StringUtils.toHyphenCase(name.name)}`;
}

function getRegisteredControlByName(name: string): ControlMetadata | null {
    return registeredControls.find(m => String(m.name) == name) || null;
}

function getRegisteredControlByDOMName(domName: string): ControlMetadata | null {
    return registeredControls.find(m => convertNodeNameToDOMNodeName(m.name).toLowerCase() == domName.toLowerCase()) || null;
}

function getRegisteredControlByConstructor<TControl extends Control>(controlConstructor: Class<Control>): ControlMetadata<TControl> | null {
    return registeredControls.find(m => m.controlClass === controlConstructor) || null;
}

function registerControl(metadata: ControlMetadata) {
    registeredControls.add(metadata);
    fullUpdate.trigger();
}

function initializeControlInstance<TControl extends Control>(metadata: ControlMetadata, element: Element): TControl {
    const controlClass: Class<Control> = metadata.controlClass;
    const domName = convertNodeNameToDOMNodeName(metadata.name);
    const controlInstance = new (<ControlConstructor<TControl>>controlClass)(domName);
    controlInstance.initialize(element);
    metadata.activeInstances.add(controlInstance);
    return controlInstance;
}

function initializeControlInstanceByElement(element: Element) {
    const metadata = getRegisteredControlByDOMName(element.nodeName);
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
    const metadata = getRegisteredControlByName(element.nodeName);
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

export function getByName(name: string) {
    assertParams({ name }, [String]);

    return getRegisteredControlByName(name);
}

function assertControlConstructor<TControl extends Control>(controlConstructor: Class<TControl>) {
    if (!Type.get(controlConstructor).extends(Type.get(Control)))
        throw new ArgumentTypeException("controlConstructor", controlConstructor, Control);
}

export function getByConstructor<TControl extends Control>(controlConstructor: Class<TControl>) {
    assertParams({ controlConstructor }, [Function]);
    assertControlConstructor(controlConstructor);

    return getRegisteredControlByConstructor(controlConstructor);
}

export function register<TControl extends Control>(controlConstructor: Class<TControl>, name: string): void {
    assertParams({ controlConstructor }, [Function]);
    assertParams({ name }, [String]);
    assertControlConstructor(controlConstructor);

    if (getRegisteredControlByConstructor(controlConstructor))
        throw new InvalidOperationException("Cannot register control. The specified control constructor is already in use.");
    else {
        if (getRegisteredControlByName(name))
            throw new InvalidOperationException("Cannot register control. The specified control name and namespace URI are already in use.");
        else {
            const metadata: ControlMetadata = new ControlMetadata(controlConstructor, name);
            registerControl(metadata);
        }
    }
}

export function deregister<TControl extends Control>(controlConstructor: Class<TControl>): void {
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
        const domName = convertNodeNameToDOMNodeName(metadata.name);
        const element = document.createElement(domName);
        return <TControl>initializeControlInstance(metadata, element);
    }
    else
        throw new InvalidOperationException("Cannot instantiate control. No registered control matches the specified control constructor.");
}

const fullUpdate = new DeferredTask(() => {
    function recursive(elem: Element) {
        for (let child of elem.children) {
            initializeControlInstanceByElement(child);

            recursive(child);
        }
    }

    recursive(document.body);
});

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
    fullUpdate.trigger();
    observeDOM();
}
window.addEventListener("load", window_load_handler);

function window_beforeUnload_handler() {
    deobserveDOM();
}
window.addEventListener("beforeunload", window_beforeUnload_handler);