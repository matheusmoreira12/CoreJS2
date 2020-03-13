import { Class } from "../../CoreBase/Utils/Types";
import { Destructible } from "../Destructible";
import { BlendedInstanceInfo, DoPredicate } from "./Types";

const allBlendedInstances: BlendedInstanceInfo[] = [];

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