import { Class } from "../Types/Types.js";

export type BlendedInstanceInfo<TTarget, TBlend> = {
    blendClass: Class<any>;
    blend: TBlend | null;
    targetObj: TTarget;
};

export namespace BlendedInstanceInfo {
    export function create<TTarget, TBlend>(blendClass: Class<TBlend>, targetObj: TTarget): BlendedInstanceInfo<TTarget, TBlend> {
        return {
            blendClass,
            blend: null,
            targetObj
        };
    }
}
