import { Class } from "../../CoreBase/Utils/Types";
import { Instance } from "../Types/Types";
import { Destructible } from "../Destructible";

type BlendedInstanceInfo = {
    blendedClass: Class<any>,
    blendedInstance: any
    obj: object
};

namespace BlendedInstanceInfo {
    export function create(blendedClass: Class<any>, obj: object): BlendedInstanceInfo {
        return {
            blendedClass,
            blendedInstance: null,
            obj
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

    initialize(sourceObj: object, blendClass: Class<any>, ...args: []): Instance<typeof blendClass> {
        const blendedInstance = allBlendedInstances.find(bi => bi.obj === sourceObj || bi.blendedClass === blendClass);
        const isBlended = !!blendedInstance;
        if (isBlended) {
            const newBlendedInstance = new blendClass(args);
            return <Instance<typeof blendClass>>newBlendedInstance;
        }
        else
            return null;
    },

    get(sourceObj: object, blendedClass: Class<any>): (Instance<typeof blendedClass>) | null {
        const blendedInstanceInfo = allBlendedInstances.find(bi => bi.obj === sourceObj || bi.blendedClass === blendedClass);
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