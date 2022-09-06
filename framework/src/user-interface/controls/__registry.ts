import { Collection } from "../../standard/collections/index.js";
import { Control } from "./index.js";
import { TryOutput } from "../../standard/reflection/types.js";
import { NotImplementedException } from "../../standard/exceptions/framework-exception.js";

import { ControlConstructor } from "./types";
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

export function tryGetDOMElementName(ctor: ControlConstructor, output: TryOutput<string>): boolean {
    const tryGetControlDataOutput: TryOutput<ControlData> = {};
    if (!tryGetControlData(ctor, tryGetControlDataOutput))
        return false;

    output.result = tryGetControlDataOutput.result!.elementName;
    return true;
}

export function tryGetDOMElementNamespaceURI(ctor: ControlConstructor, output: TryOutput<string>): boolean {
    const tryGetControlDataOutput: TryOutput<ControlData> = {};
    if (!tryGetControlData(ctor, tryGetControlDataOutput))
        return false;

    output.result = tryGetControlDataOutput.result!.elementNamespaceURI;
    return true;
}

function tryGetControlData(ctor: ControlConstructor, output: TryOutput<ControlData> = {}): boolean {
    const controlData = registeredControls.get(ctor);
    if (controlData === undefined)
        return false;

    output.result = controlData;
    return true;
}