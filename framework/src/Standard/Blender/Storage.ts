import { BlendedInstanceInfo } from "./BlendedInstanceInfo";
import { Class, TryOutput } from "../../Standard/Types/index";
import { Destructible } from "../Destructible";

export namespace Storage {
    const allBlendedInstances: BlendedInstanceInfo<object, any>[] = [];

    export function tryStore<TBlend, TTarget extends object>(blendClass: Class<TBlend>, targetObj: TTarget): boolean {
        if (tryGet(<Class<any>>targetObj, blendClass))
            return false;
        else {
            const instance = BlendedInstanceInfo.create(blendClass, targetObj);
            allBlendedInstances.push(instance);
            return true;
        }
    }

    function removeInstance(instance: BlendedInstanceInfo<object, any>) {
        allBlendedInstances.splice(allBlendedInstances.indexOf(instance), 1);
    }

    export function tryDiscard<TBlend, TTarget extends object>(baseClass: Class<TBlend>, targetObj: TTarget): boolean {
        const tryGetOutput: TryOutput<BlendedInstanceInfo<TTarget, TBlend>> = {};
        if (tryGet(baseClass, targetObj, {})) {
            const info = <BlendedInstanceInfo<TTarget, TBlend>>tryGetOutput.result;
            if (info.blend) {
                const blend = <TBlend>info.blend;
                const isInstanceIntitialized = blend !== null;
                if (isInstanceIntitialized) {
                    if (blend instanceof Destructible) {
                        if ((<Destructible>blend).isDestructed)
                            (<Destructible>blend).destruct();
                    }
                }
                return true;
            }
            removeInstance(<BlendedInstanceInfo<TTarget, TBlend>>tryGetOutput.result);
            return true;
        }
        else
            return false;
    }

    function getInstance(blendClass: Class<any>, sourceObj: any): BlendedInstanceInfo<object, any> | null {
        return allBlendedInstances.find(bi => bi.targetObj === sourceObj && bi.blendClass === blendClass) || null
    }

    export function tryGet<TBlend, TSource extends object>(blendClass: Class<TBlend>, sourceObj: TSource, output?: TryOutput<BlendedInstanceInfo<TSource, TBlend>>): boolean {
        output = output || {};

        const instance = <BlendedInstanceInfo<TSource, TBlend>>getInstance(blendClass, sourceObj);
        if (instance === undefined)
            return false;
        else {
            output.result = instance;
            return true;
        }
    }
}