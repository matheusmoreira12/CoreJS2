import { ObjectUtils } from "../../CoreBase/Utils/index.js";

function createMixin(...classes: any[]): any {
    let result = ObjectUtils.getBlank(classes[0]);
    for (let i = 1; i < classes.length; i++)
        ObjectUtils.crudeCopy(classes[i], result);
    return result;
}

export type Mixin<T1, T2, T3 = undefined, T4 = undefined, T5 = undefined, T6 = undefined, T7 = undefined, T8 = undefined, T9 = undefined, T10 = undefined> = {
    [P in keyof (T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10)]: keyof (T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10)[P];
}

export namespace Mixin {
    export function create<T1, T2, T3 = undefined, T4 = undefined, T5 = undefined, T6 = undefined, T7 = undefined, T8 = undefined, T9 = undefined, T10 = undefined>(class1: new () => T1, class2: new () => T2, class3?: new () => T3, class4?: new () => T4, class5?: new () => T5, class6?: new () => T6, class7?: new () => T7, class8?: new () => T8, class9?: new () => T9, class10?: new () => T10): Mixin<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        return <Mixin<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>>createMixin(class1, class2, class3, class4, class5, class6, class7, class8, class9, class10);
    }
}