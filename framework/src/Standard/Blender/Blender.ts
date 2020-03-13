import { Class } from "../../CoreBase/Utils/Types";
import { Instance } from "../Types/Types";
import { Destructible } from "../Destructible";

type BlendedInstanceInfo = {
    blendedClass: Class<any>,
    blendedInstance: any
    destObj: object
};

namespace BlendedInstanceInfo {
    export function create(blendedClass: Class<any>, destObj: object): BlendedInstanceInfo {
        return {
            blendedClass,
            blendedInstance: null,
            destObj
        }
    }
}

const allBlendedInstances: BlendedInstanceInfo[] = [];

export const Blender = {
    blend(blendClass: Class<any>, destObj: object) {
        const isBlended = !!this.get(destObj, blendClass);
        if (isBlended)
            return false;
        else {
            const blendedInstanceInfo = BlendedInstanceInfo.create(blendClass, destObj);
            allBlendedInstances.push(blendedInstanceInfo);
            return true;
        }
    },

    initialize(blendClass: Class<any>, destObj: object, ...args: []): Instance<typeof blendClass> {
        const blendedInstance = allBlendedInstances.find(bi => bi.destObj === destObj || bi.blendedClass === blendClass);
        const isBlended = !!blendedInstance;
        if (isBlended) {
            const newBlendedInstance = new blendClass(args);
            return <Instance<typeof blendClass>>newBlendedInstance;
        }
        else
            return null;
    },

    get(sourceObj: object, blendedClass: Class<any>): (Instance<typeof blendedClass>) | null {
        const blendedInstanceInfo = allBlendedInstances.find(bi => bi.destObj === sourceObj || bi.blendedClass === blendedClass);
        const isBlended = !!blendedInstanceInfo;
        if (isBlended)
            return <Instance<typeof blendedClass>>(<BlendedInstanceInfo>blendedInstanceInfo).blendedClass;
        else
            return null;
    },

    deblend(sourceObj: object, blendedClass: Class<any>): boolean {
        const blendedInstance = this.get(sourceObj, blendedClass);
        const isBlended = !!blendedInstance;
        if (isBlended) {
            const isInstanceDestructible = blendedInstance instanceof Destructible;
            if (isInstanceDestructible && !blendedInstance.isDestructed)
                blendedInstance.Destruct();

            return true;
        }
        else
            return false;
    }
};