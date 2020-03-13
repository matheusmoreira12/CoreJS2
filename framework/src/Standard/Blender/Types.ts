import { Class } from "../Types/Types";

export type BlendedInstanceInfo = {
    blendClass: Class<any>,
    blend: any
    obj: object
};

export namespace BlendedInstanceInfo {
    export function create(blendClass: Class<any>, obj: object): BlendedInstanceInfo {
        return {
            blendClass,
            blend: null,
            obj
        }
    }
}

export type DoPredicate<TBlend extends Object, TResult> = (blend: TBlend) => TResult;