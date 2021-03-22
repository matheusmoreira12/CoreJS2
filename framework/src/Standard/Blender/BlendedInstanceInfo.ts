import { ClassOf } from "../Reflection/Types.js";

export type BlendedInstanceInfo<TTarget, TBlend> = {
    blendClass: ClassOf<any>;
    blend: TBlend | null;
    targetObj: TTarget;
};

export namespace BlendedInstanceInfo {
    export function create<TTarget, TBlend>(blendClass: ClassOf<TBlend>, targetObj: TTarget): BlendedInstanceInfo<TTarget, TBlend> {
        return {
            blendClass,
            blend: null,
            targetObj
        };
    }
}
