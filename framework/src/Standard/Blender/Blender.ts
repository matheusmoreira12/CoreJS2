import { Class } from "../../CoreBase/Utils/Types";
import { Destructible } from "../Destructible";
import { BlendedInstanceInfo, DoPredicate } from "./Types";

const allBlendedInstances: BlendedInstanceInfo[] = [];

function getBlendInstanceInfoIndex(sourceObj: object, blendClass: Class<any>): number {
    return allBlendedInstances.findIndex(bi => bi.obj === sourceObj && bi.blendClass === blendClass);
}

export const Blender = {
    blend(blendClass: Class<any>, destObj: object) {
        const infoIndex = getBlendInstanceInfoIndex(destObj, blendClass);
        const isBlended = infoIndex != -1;
        if (isBlended)
            return false;
        else {
            const blendInfo = BlendedInstanceInfo.create(blendClass, destObj);
            allBlendedInstances.push(blendInfo);
            return true;
        }
    },

    get<TBlendedInstance extends Object>(sourceObj: object, blendClass: Class<TBlendedInstance>): TBlendedInstance | null {
        const infoIndex = getBlendInstanceInfoIndex(sourceObj, blendClass);
        const isBlended = infoIndex != -1;
        if (isBlended)
            return <TBlendedInstance>(<BlendedInstanceInfo>allBlendedInstances[infoIndex]).blend;
        else
            return null;
    },

    initialize<TBlendInstance extends Object>(sourceObj: object, blendClass: Class<TBlendInstance>, ...constructorArgs: []): TBlendInstance | null {
        const infoIndex = getBlendInstanceInfoIndex(sourceObj, blendClass);
        const isBlended = infoIndex != -1;
        if (isBlended) {
            const newBlend = new blendClass(constructorArgs);

            const info = allBlendedInstances[infoIndex];
            info.blend = newBlend;

            return <TBlendInstance>newBlend;
        }
        else
            return null;
    },

    deblend(sourceObj: object, blendClass: Class<any>): boolean {
        const infoIndex = getBlendInstanceInfoIndex(sourceObj, blendClass);
        const isBlended = infoIndex != -1;
        if (isBlended) {
            const info = allBlendedInstances[infoIndex];

            const isInstanceDestructible = info.blend instanceof Destructible;
            if (isInstanceDestructible && !info.blend.isDestructed)
                info.blend.Destruct();

            allBlendedInstances.splice(infoIndex, 1);
            return true;
        }
        else
            return false;
    },

    do<TBlend extends Object, TResult>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult>, thisArg?: any): TResult | undefined {
        const blend = this.get(sourceObj, blendClass);
        const isBlended = !!blend;
        if (isBlended)
            return predicate.call(thisArg, <TBlend>blend);
        else
            return undefined;
    }
};