import { ClassOf } from "../reflection/types";

export type BlendedInstanceInfo<TTarget, TBlend> = {
    blendClass: ClassOf<any>;
    blend: TBlend | null;
    targetObj: TTarget;
};

export namespace BlendedInstanceInfo {
    export function create<TTarget extends object, TBlend extends object>(blendClass: ClassOf<TBlend>, targetObj: TTarget): BlendedInstanceInfo<TTarget, TBlend> {
        return {
            blendClass,
            blend: null,
            targetObj
        };
    }
}
