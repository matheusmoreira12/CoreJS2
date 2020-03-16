import { Class } from "../Types/Types";

export type BlendedInstanceInfo<TTarget extends object, TBlend> = {
    blendClass: Class<any>;
    blend: TBlend | null;
    targetObj: TTarget;
};

export namespace BlendedInstanceInfo {
    export function create<TTarget extends object, TBlend>(blendClass: Class<TBlend>, targetObj: TTarget): BlendedInstanceInfo<TTarget, TBlend> {
        return {
            blendClass,
            blend: null,
            targetObj
        };
    }
}
