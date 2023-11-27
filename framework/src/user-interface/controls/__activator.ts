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
    const outInstanceData: OutputArgument<ControlInstanceData> = {};
    if (!tryGetControlInstanceData(instance, outInstanceData))
        return false;
    const instanceData = outInstanceData.value!;

    if (instanceData.hasInitialized)
        return false;

    instance.initialize();
    instanceData.hasInitialized = true;

    return true;
}

export function tryFinalizeInstance(instance: Control): boolean {
    const outInstanceData: OutputArgument<ControlInstanceData> = {};
    if (!tryGetControlInstanceData(instance, outInstanceData))
        return false;
    const instanceData = outInstanceData.value!;

    if (!instanceData.hasInitialized)
        return false;

    if (instanceData.hasFinalized)
        return false;

    instance.finalize();
    instanceData.hasFinalized = true;

    return true;
}

export function tryGetControlInstanceDOMElement(instance: Control, outElement: OutputArgument<Element>) {
    const outInstanceData: OutputArgument<ControlInstanceData> = {};
    if (!tryGetControlInstanceData(instance, outInstanceData))
        return false;
    const instanceData = outInstanceData.value!;

    outElement.value = instanceData.domElement;

    return true;
}

function tryGetControlInstanceData(instance: Control, outData: OutputArgument<ControlInstanceData> = {}) {
    const instanceData = controlInstances.get(instance);
    if (instanceData === undefined)
        return false;
    outData.value = instanceData;
    return true;
}

export function tryBeginControlInstanceLifecycle(instance: Control): boolean {
    const outDOMElement: OutputArgument<Element> = {};
    if (!tryCreateDOMElement(instance, outDOMElement))
        return false;
    const domElement = outDOMElement.value!;

    controlInstances.set(instance, ControlInstanceData.create(domElement));

    if (!tryInitializeInstance(instance))
        return false;

    return true;
}

function tryCreateDOMElement(instance: Control, outElement: OutputArgument<Element>) {
    const outName: OutputArgument<string> = {};
    const outNamespaceURI: OutputArgument<string> = {};
    if (!__Registry.tryGetDOMElementName(instance.constructor as ControlConstructor, outName, outNamespaceURI))
        return false;
    const name = outName.value!;
    const namespaceURI = outNamespaceURI.value!;

    if (namespaceURI == "http://www.w3.org/1999/xhtml") {
        switch (name) {
            case "html":
                outElement.value = document.documentElement;
                return true;

            case "head":
                outElement.value = document.head;
                return true;

            case "body":
                outElement.value = document.body;
                return true;
        }
    }

    const is = instance.constructor.name;
    const domElement = document.createElementNS(namespaceURI, name, { is });
    outElement.value = domElement;
    return true;
}

export function tryEndControlInstanceLifecycle(instance: Control): boolean {
    if (!tryFinalizeInstance(instance))
        return false;

    controlInstances.delete(instance);

    return true;
}

export function hasActiveInstances(ctor: ControlConstructor) {
    return Array.from(controlInstances.keys()).some(i => i instanceof ctor);
}