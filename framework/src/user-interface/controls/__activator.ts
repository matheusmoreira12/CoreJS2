import { OutputArgument } from "../../standard/reflection/types";
import { Control } from "./index.js";

import { ControlConstructor } from "./control-constructor";
import * as __Registry from "./__registry.js";

const controlInstances: Map<Control, ControlInstanceData> = new Map();

interface ControlInstanceData {
    domElement: Element;
    hasInitialized: boolean;
    hasFinalized: boolean;
}

namespace ControlInstanceData {
    export function create(element: Element): ControlInstanceData {
        return {
            domElement: element,
            hasInitialized: false,
            hasFinalized: false,
        };
    }
}

export function tryInitializeInstance(instance: Control): boolean {
    const tryGetControlInstanceDataOutput: OutputArgument<ControlInstanceData> = {};
    if (!tryGetControlInstanceData(instance, tryGetControlInstanceDataOutput))
        return false;

    const instanceData = tryGetControlInstanceDataOutput.value!;
    if (instanceData.hasInitialized)
        return false;

    instance.initialize();

    instanceData.hasInitialized = true;

    return true;
}

export function tryFinalizeInstance(instance: Control): boolean {
    const tryGetControlInstanceDataOutput: OutputArgument<ControlInstanceData> = {};
    if (!tryGetControlInstanceData(instance, tryGetControlInstanceDataOutput))
        return false;
    const instanceData = tryGetControlInstanceDataOutput.value!;
    if (!instanceData.hasInitialized)
        return false;
    if (instanceData.hasFinalized)
        return false;
    instance.finalize();
    instanceData.hasFinalized = true;
    return true;
}

export function tryGetControlInstanceDOMElement(instance: Control, output: OutputArgument<Element>) {
    const tryGetControlInstanceDataOutput: OutputArgument<ControlInstanceData> = {};
    if (!tryGetControlInstanceData(instance, tryGetControlInstanceDataOutput))
        return false;
    const instanceData = tryGetControlInstanceDataOutput.value!;
    output.value = instanceData.domElement;
    return true;
}

function tryGetControlInstanceData(instance: Control, output: OutputArgument<ControlInstanceData> = {}) {
    const instanceData = controlInstances.get(instance);
    if (instanceData === undefined)
        return false;

    output.value = instanceData;
    return true;
}

export function tryBeginControlInstanceLifecycle(instance: Control): boolean {
    const tryCreateDOMElementOutput: OutputArgument<Element> = {};
    if (!tryCreateDOMElement(instance, tryCreateDOMElementOutput))
        return false;

    const domElement = tryCreateDOMElementOutput.value!;
    controlInstances.set(instance, ControlInstanceData.create(domElement));

    if (!tryInitializeInstance(instance))
        return false;

    return true;
}

function tryCreateDOMElement(instance: Control, output: OutputArgument<Element>) {
    const tryGetDOMElementNameOutput: OutputArgument<string> = {};
    if (!__Registry.tryGetDOMElementName(instance.constructor as ControlConstructor, tryGetDOMElementNameOutput))
        return false;

    const tryGetDOMElementNamespaceURIOutput: OutputArgument<string> = {};
    if (!__Registry.tryGetDOMElementNamespaceURI(instance.constructor as ControlConstructor, tryGetDOMElementNamespaceURIOutput))
        return false;

    const name = tryGetDOMElementNameOutput.value!;
    const namespaceURI = tryGetDOMElementNamespaceURIOutput.value!;
    if (namespaceURI == "http://www.w3.org/1999/xhtml") {
        switch (name) {
            case "html":
                output.value = document.documentElement;
                return true;
            case "head":
                output.value = document.head;
                return true;
            case "body":
                output.value = document.body;
                return true;
        }
    }

    const is = instance.constructor.name;
    const domElement = document.createElementNS(namespaceURI, name, { is });
    output.value = domElement;
    return true;
}

export function tryEndControlInstanceLifecycle(instance: Control): boolean {
    if (instance.isDestructed)
        return false;
    if (!tryFinalizeInstance(instance))
        return false;
    instance.destruct();
    controlInstances.delete(instance);
    return true;
}

export function hasActiveInstances(ctor: ControlConstructor) {
    return Array.from(controlInstances.keys()).some(i => i instanceof ctor);
}