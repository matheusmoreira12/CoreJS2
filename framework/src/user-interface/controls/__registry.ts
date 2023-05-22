import { OutputArgument } from "../../standard/reflection/types.js";

import { ControlConstructor } from "./control-constructor";
import * as __Activator from "./__activator.js"

const registeredControls: Map<ControlConstructor, ControlData> = new Map();

interface ControlData {
    ctor: ControlConstructor;
    elementName: string;
    elementNamespaceURI: string;
}

namespace ControlData {
    export function create(ctor: ControlConstructor, elementName: string, elementNamespaceURI: string): ControlData {
        return {
            ctor,
            elementName,
            elementNamespaceURI,
        };
    }
}

export function tryRegister(ctor: ControlConstructor, elementName: string, elementNamespaceURI: string): boolean {
    if (isRegistered(ctor))
        return false;

    registeredControls.set(ctor, ControlData.create(ctor, elementName, elementNamespaceURI));
    return true;
}

export function tryDeRegister(ctor: ControlConstructor): boolean {
    if (!isRegistered(ctor))
        return false;
    
    if (!__Activator.hasActiveInstances(ctor))
        return false;

    registeredControls.delete(ctor);
    return true;
}

export function isRegistered(ctor: ControlConstructor): boolean {
    return registeredControls.has(ctor);
}

export function tryGetDOMElementName(ctor: ControlConstructor, outName: OutputArgument<string>, outNamespaceURI: OutputArgument<string>): boolean {
    const tryGetControlDataOutput: OutputArgument<ControlData> = {};
    if (!tryGetControlData(ctor, tryGetControlDataOutput))
        return false;

    outName.value = tryGetControlDataOutput.value!.elementName;
    outNamespaceURI.value = tryGetControlDataOutput.value!.elementNamespaceURI;
    return true;
}

function tryGetControlData(ctor: ControlConstructor, output: OutputArgument<ControlData> = {}): boolean {
    const controlData = registeredControls.get(ctor);
    if (controlData === undefined)
        return false;

    output.value = controlData;
    return true;
}