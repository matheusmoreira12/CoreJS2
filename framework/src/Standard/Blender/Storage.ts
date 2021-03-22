import { BlendedInstanceInfo } from "./BlendedInstanceInfo.js";
import { ClassOf, TryOutput } from "../Reflection/Types.js";
import { Destructible } from "../Destructible.js";

export namespace Storage {
    const allBlendedInstances: BlendedInstanceInfo<any, any>[] = [];

    export function tryStore<TBlend, TTarget>(blendClass: ClassOf<TBlend>, targetObj: TTarget): boolean {
        if (tryGet(<ClassOf<any>>targetObj, blendClass))
            return false;
        else {
            const instance = BlendedInstanceInfo.create(blendClass, targetObj);
            allBlendedInstances.push(instance);
            return true;
        }
    }

    function removeInstance(instance: BlendedInstanceInfo<any, any>) {
        allBlendedInstances.splice(allBlendedInstances.indexOf(instance), 1);
    }

    export function tryDiscard<TBlend, TTarget>(baseClass: ClassOf<TBlend>, targetObj: TTarget): boolean {
        const tryGetOutput: TryOutput<BlendedInstanceInfo<TTarget, TBlend>> = {};
        if (tryGet(baseClass, targetObj, {})) {
            const info = <BlendedInstanceInfo<TTarget, TBlend>>tryGetOutput.result;
            if (info.blend) {
                const blend = <TBlend>info.blend;
                const isInstanceIntitialized = !!blend;
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

    function getInstance(blendClass: ClassOf<any>, sourceObj: any): BlendedInstanceInfo<any, any> | null {
        return allBlendedInstances.find(bi => bi.targetObj === sourceObj && bi.blendClass === blendClass) || null
    }

    export function tryGet<TBlend, TSource>(blendClass: ClassOf<TBlend>, sourceObj: TSource, output?: TryOutput<BlendedInstanceInfo<TSource, TBlend>>): boolean {
        output = output || {};

        const instance = <BlendedInstanceInfo<TSource, TBlend>>getInstance(blendClass, sourceObj);
        if (instance) {
            output.result = instance;
            return true;
        }
        else
            return false;
    }
}