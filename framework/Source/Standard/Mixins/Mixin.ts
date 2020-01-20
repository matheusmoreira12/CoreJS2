import { ObjectUtils } from "../../CoreBase/Utils/index.js";
import { ArgumentMissingException } from "../Exceptions.js";

function createMixin(...objs: any): any {
    let result: MixinBase = ObjectUtils.getBlank(objs[0]);
    result.isMixin = true;
    result.mixinObjects = objs;

    for (let i = 0; i < objs.length; i++)
        ObjectUtils.crudeCopy(objs[i], result, false, true);

    return result;
}

export type MixinBase = {
    isMixin: boolean;
    mixinObjects: any[];
};

export namespace Mixin {
    export function create<T1, T2>(obj1: T1, obj2: T2): T1 & T2 & MixinBase;
    export function create<T1, T2, T3>(obj1: T1, obj2: T2, obj3?: T3): T1 & T2 & T3 & MixinBase;
    export function create<T1, T2, T3, T4>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4): T1 & T2 & T3 & T4 & MixinBase;
    export function create<T1, T2, T3, T4, T5>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5): T1 & T2 & T3 & T4 & T5 & MixinBase;
    export function create<T1, T2, T3, T4, T5, T6>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6): T1 & T2 & T3 & T4 & T5 & T6 & MixinBase;
    export function create<T1, T2, T3, T4, T5, T6, T7>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6, obj7?: T7): T1 & T2 & T3 & T4 & T5 & T6 & T7 & MixinBase;
    export function create<T1, T2, T3, T4, T5, T6, T7, T8>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6, obj7?: T7, obj8?: T8): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & MixinBase;
    export function create<T1, T2, T3, T4, T5, T6, T7, T8, T9>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6, obj7?: T7, obj8?: T8, obj9?: T9): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & MixinBase;
    export function create<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6, obj7?: T7, obj8?: T8, obj9?: T9, obj10?: T10): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & MixinBase;
    export function create(...objs: any[]): any {
        if (arguments.length < 1)
            throw new ArgumentMissingException("obj1");
        if (arguments.length < 1)
            throw new ArgumentMissingException("obj2");

        return createMixin(...objs);
    }
}