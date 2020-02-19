import { ObjectUtils } from "../CoreBase/Utils/index";

const $baseClass = Symbol();
const $mixinClasses = Symbol();

export class Mixin<TBase, T1, T2 = undefined, T3 = undefined, T4 = undefined, T5 = undefined, T6 = undefined, T7 = undefined> {
    static create<TBase, T1>(baseClass: TBase, class1: T1): Mixin<TBase, T1> & TBase & T1;
    static create<TBase, T1, T2>(baseClass: TBase, class1: T1, class2: T2): Mixin<TBase, T1, T2> & TBase & T1 & T2;
    static create<TBase, T1, T2, T3>(baseClass: TBase, class1: T1, class2: T2, class3: T3): Mixin<TBase, T1, T2, T3> & TBase & T1 & T2 & T3;
    static create<TBase, T1, T2, T3, T4>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4): Mixin<TBase, T1, T2, T3, T4> & TBase & T1 & T2 & T3 & T4;
    static create<TBase, T1, T2, T3, T4, T5>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4, class5: T5): Mixin<TBase, T1, T2, T3, T4, T5> & TBase & T1 & T2 & T3 & T4 & T5;
    static create<TBase, T1, T2, T3, T4, T5, T6>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4, class5: T5, class6: T6): Mixin<TBase, T1, T2, T3, T4, T5, T6> & TBase & T1 & T2 & T3 & T4 & T5 & T6;
    static create<TBase, T1, T2, T3, T4, T5, T6, T7>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4, class5: T5, class6: T6, class7: T7): Mixin<TBase, T1, T2, T3, T4, T5, T6, T7> & TBase & T1 & T2 & T3 & T4 & T5 & T6 & T7;
    static create<TBase, T1, T2 = undefined, T3 = undefined, T4 = undefined, T5 = undefined, T6 = undefined, T7 = undefined>(baseClass: TBase, ...mixinClasses: (T1 | T2 | T3 | T4 | T5 | T6 | T7)[]): Mixin<TBase, T1, T2, T3, T4, T5, T6, T7> & TBase & T1 & T2 & T3 & T4 & T5 & T6 & T7 {
        const result = new Mixin();
        applyMixins(result, baseClass, mixinClasses);

        return <any>result;
    }

    constructor() {
    }

    get baseClass(): TBase { return this[$baseClass]; }
    get mixinClasses(): (T1 | T2 | T3 | T4 | T5 | T6 | T7)[] { return this[$mixinClasses]; }

    private [$baseClass]: TBase;
    private [$mixinClasses]: (T1 | T2 | T3 | T4 | T5 | T6 | T7)[];
}

function applyMixins(result: object, baseClass: any, mixinClasses: any[]) {
    ObjectUtils.crudeCopy(baseClass, result);
    for (let mixinClass of mixinClasses)
        ObjectUtils.crudeCopy(mixinClass, result, false);
}