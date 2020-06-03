import { Collection } from "../../Standard/Collections/index.js";
import { Control } from "./index.js";
import { Class, TryOutput } from "../../Standard/Types/Types.js";

const registeredControls = new Collection<ControlInfo>();

const controlInstances = new Collection<ControlInstanceInfo>();

interface ControlInfo {
    ctor: Class<Control>;
    elementName: string;
}

interface ControlInstanceInfo {
    ctor: Class<Control>;
    instance: Control;
    element: Element;
}

type ControlConstructor = new () => Control;

export function tryInitializeInstance(): boolean {

}

export function tryFinalizeInstance(): boolean {
    
}

export function tryCreateInstance(ctor: Class<Control>, output: TryOutput<Control>): boolean {
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

export function tryRegister(ctor: Class<Control>, elementName: string): boolean {
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

export function tryDeRegister(ctor: Class<Control>, forceQuit: boolean = false): boolean {
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