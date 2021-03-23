import { Collection } from "../../Standard/Collections/index.js";
import { Control } from "./index.js";
import { ClassOfOf, TryOutput } from "../../Standard/Reflection/Types.js";

const registeredControls = new Collection<ControlInfo>();

const controlInstances = new Collection<ControlInstanceInfo>();

interface ControlInfo {
    ctor: ClassOfOf<Control>;
    elementName: string;
}

interface ControlInstanceInfo {
    ctor: ClassOfOf<Control>;
    instance: Control;
    element: Element;
}

type ControlConstructor = new () => Control;

export function tryInitializeInstance(): boolean {

}

export function tryFinalizeInstance(): boolean {
    
}

export function tryCreateInstance(ctor: ClassOfOf<Control>, output: TryOutput<Control>): boolean {
    const info = registeredControls.find(i => i.ctor === ctor);
    if (info) {
        const domElem = document.createElement(info.elementName);
        const instance = new (<ControlConstructor>ctor)();
        output.result = instance;
        return true;
    }
    else
        return false;
}

export function tryQuitInstance(instance: Control): boolean {
    const index = controlInstances.findIndex(i => i.instance === instance);
    if (index == -1)
        return false;
    else {
        if (instance.isDestructed)
            return false;
        else {
            instance.destruct();
            controlInstances.splice(index, 1);
            return true;
        }
    }
}

export function tryGetDOMElement(instance: Control, output: TryOutput<Element>): boolean {
    const instanceInfo = controlInstances.find(i => i.instance === instance);
    if (instanceInfo) {
        output.result = instanceInfo.element;
        return true;
    }
    else
        return false;
}

export function tryRegister(ctor: ClassOfOf<Control>, elementName: string): boolean {
    const isElementNameRegistered = registeredControls.some(e => e.elementName);
    if (isElementNameRegistered)
        return false;
    else {
        const isCtorRegistered = registeredControls.some(e => e.ctor === ctor);
        if (isCtorRegistered)
            return false;
        else {
            const info = {
                elementName, ctor
            };
            registeredControls.add(info);
            return true;
        }
    }
}

export function tryDeRegister(ctor: ClassOfOf<Control>, forceQuit: boolean = false): boolean {
    const controlInfo = registeredControls.find(c => c.ctor === ctor);
    if (controlInfo) {
        const instanceInfos = controlInstances.filter(i => i.ctor === ctor);
        if (instanceInfos.length == 0 || forceQuit) {
            for (let instanceInfo of instanceInfos)
                tryQuitInstance(instanceInfo.instance);
            return true;
        }
        else
            return false
    }
    else
        return false;
}