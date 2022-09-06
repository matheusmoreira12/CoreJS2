import { TryOutput } from "../../standard/reflection/types";
import { Control } from "./index.js";

import { ControlConstructor } from "./types";
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
    const tryGetControlInstanceDataOutput: TryOutput<ControlInstanceData> = {};
    if (!tryGetControlInstanceData(instance, tryGetControlInstanceDataOutput))
        return false;

    const instanceData = tryGetControlInstanceDataOutput.result!;
    if (instanceData.hasInitialized)
        return false;

    instance.initialize(instanceData.domElement);

    instanceData.hasInitialized = true;

    return true;
}

export function tryFinalizeInstance(instance: Control): boolean {
    const tryGetControlInstanceDataOutput: TryOutput<ControlInstanceData> = {};
    if (!tryGetControlInstanceData(instance, tryGetControlInstanceDataOutput))
        return false;
    const instanceData = tryGetControlInstanceDataOutput.result!;
    if (!instanceData.hasInitialized)
        return false;
    if (instanceData.hasFinalized)
        return false;
    instance.finalize();
    instanceData.hasFinalized = true;
    return true;
}

export function tryBeginControlInstanceLifecycle(instance: Control): boolean {
    if (!tryInitializeInstance(instance))
        return false;

    const tryCreateDOMElementOutput: TryOutput<Element> = {};
    if (!tryCreateDOMElement(instance, tryCreateDOMElementOutput))
        return false;

    const domElement = tryCreateDOMElementOutput.result!;
    controlInstances.set(instance, ControlInstanceData.create(domElement));
    return true;
}

function tryCreateDOMElement(instance: Control, output: TryOutput<Element>) {
    const tryGetDOMElementNameOutput: TryOutput<string> = {};
    if (!__Registry.tryGetDOMElementName(instance.constructor as ControlConstructor, tryGetDOMElementNameOutput))
        return false;

    const tryGetDOMElementNamespaceURIOutput: TryOutput<string> = {};
    if (!__Registry.tryGetDOMElementNamespaceURI(instance.constructor as ControlConstructor, tryGetDOMElementNamespaceURIOutput))
        return false;

    const name = tryGetDOMElementNameOutput.result!;
    const namespaceURI = tryGetDOMElementNamespaceURIOutput.result!;
    const is = instance.constructor.name;
    const domElement = document.createElementNS(namespaceURI, name, { is });
    output.result = domElement;
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

export function tryGetDOMElement(instance: Control, output: TryOutput<Element>): boolean {
    const tryGetControlInstanceDataOutput: TryOutput<ControlInstanceData> = {};
    if (!tryGetControlInstanceData(instance, tryGetControlInstanceDataOutput))
        return false;
    const instanceData = tryGetControlInstanceDataOutput.result!;
    output.result = instanceData.domElement;
    return true;
}

function tryGetControlInstanceData(instance: Control, output: TryOutput<ControlInstanceData> = {}) {
    const instanceData = controlInstances.get(instance);
    if (instanceData === undefined)
        return false;

    output.result = instanceData;
    return true;
}

export function hasActiveInstances(ctor: ControlConstructor) {
    return Array.from(controlInstances.keys()).some(i => i instanceof ctor);
}