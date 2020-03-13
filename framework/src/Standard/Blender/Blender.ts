import { Class } from "../../CoreBase/Utils/Types";
import { Instance } from "../Types/Types";
import { Destructible } from "../Destructible";

type BlendedInstanceInfo = {
    blendClass: Class<any>,
    blend: any
    obj: object
};

namespace BlendedInstanceInfo {
    export function create(blendClass: Class<any>, obj: object): BlendedInstanceInfo {
        return {
            blendClass,
            blend: null,
            obj
        }
    }
}

const allBlendedInstances: BlendedInstanceInfo[] = [];

type DoPredicate<TBlend extends Object, TResult> = (blend: TBlend) => TResult;

export const Blender = {
    blend(blendClass: Class<any>, destObj: object) {
        const isBlended = !!this.get(destObj, blendClass);
        if (isBlended)
            return false;
        else {
            const blendInfo = BlendedInstanceInfo.create(blendClass, destObj);
            allBlendedInstances.push(blendInfo);
            return true;
        }
    },

    initialize<TBlendInstance extends Object>(sourceObj: object, blendClass: Class<TBlendInstance>, ...constructorArgs: []): TBlendInstance | null {
        const blend = allBlendedInstances.find(bi => bi.obj === sourceObj || bi.blendClass === blendClass);
        const isBlended = !!blend;
        if (isBlended) {
            const newBlendedInstance = new blendClass(constructorArgs);
            return <TBlendInstance>newBlendedInstance;
        }
        else
            return null;
    },

    get<TBlendedInstance extends Object>(sourceObj: object, blendClass: Class<TBlendedInstance>): TBlendedInstance | null {
        const blendInfo = allBlendedInstances.find(bi => bi.obj === sourceObj || bi.blendClass === blendClass);
        const isBlended = !!blendInfo;
        if (isBlended)
            return <TBlendedInstance>(<BlendedInstanceInfo>blendInfo).blend;
        else
            return null;
    },

    deblend(sourceObj: object, blendClass: Class<any>): boolean {
        const blend = this.get(sourceObj, blendClass);
        const isBlended = !!blend;
        if (isBlended) {
            const isInstanceDestructible = blend instanceof Destructible;
            if (isInstanceDestructible && !blend.isDestructed)
                blend.Destruct();

            return true;
        }
        else
            return false;
    },

    do<TBlend extends Object, TResult>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult>): TResult | undefined {
        const blend = this.get(sourceObj, blendClass);
        const isBlended = !!blend;
        if (isBlended)
            return predicate(<TBlend>blend);
        else
            return undefined;
    }
};