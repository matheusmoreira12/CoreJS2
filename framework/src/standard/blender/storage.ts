import { Destructible } from "../destructible.js";
import { ClassOf, OutputArgument } from "../reflection/types";
import { BlendedInstanceInfo } from "./blended-instance-info.js";

export namespace Storage {
    const allBlendedInstances: BlendedInstanceInfo<any, any>[] = [];

    export function tryStore<TBlend extends object, TTarget extends object>(blendClass: ClassOf<TBlend>, targetObj: TTarget): boolean {
        if (tryGet(blendClass, targetObj))
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

    export function tryDiscard<TBlend extends object, TTarget extends object>(baseClass: ClassOf<TBlend>, targetObj: TTarget): boolean {
        const tryGetOutput: OutputArgument<BlendedInstanceInfo<TTarget, TBlend>> = {};
        if (tryGet(baseClass, targetObj, {})) {
            const info = <BlendedInstanceInfo<TTarget, TBlend>>tryGetOutput.value;
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
            removeInstance(<BlendedInstanceInfo<TTarget, TBlend>>tryGetOutput.value);
            return true;
        }
        else
            return false;
    }

    function getInstance(blendClass: ClassOf<object>, sourceObj: object): BlendedInstanceInfo<object, object> | null {
        return allBlendedInstances.find(bi => bi.targetObj === sourceObj && bi.blendClass === blendClass) || null
    }

    export function tryGet<TBlend extends object, TSource extends object>(blendClass: ClassOf<TBlend>, sourceObj: TSource, output?: OutputArgument<BlendedInstanceInfo<TSource, TBlend>>): boolean {
        output = output || {};

        const instance = <BlendedInstanceInfo<TSource, TBlend>>getInstance(blendClass, sourceObj);
        if (instance) {
            output.value = instance;
            return true;
        }
        else
            return false;
    }
}