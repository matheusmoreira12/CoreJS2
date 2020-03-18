import { Class, DataType } from "../Types/Types";

export type BlendedInstanceInfo<TTarget extends DataType, TBlend> = {
    blendClass: Class<any>;
    blend: TBlend | null;
    targetObj: TTarget;
};

export namespace BlendedInstanceInfo {
    export function create<TTarget extends DataType, TBlend>(blendClass: Class<TBlend>, targetObj: TTarget): BlendedInstanceInfo<TTarget, TBlend> {
        return {
            blendClass,
            blend: null,
            targetObj
        };
    }
}
