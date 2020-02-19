import { ObjectUtils } from "../CoreBase/Utils/index";

const $baseClass = Symbol();
const $mixinClasses = Symbol();

type Class<T = any> = Function & { prototype: T };

export class Mixin extends Function {
    static create<TBase extends Class, T1 extends Class>(baseClass: TBase, class1: T1): Mixin & TBase & T1;
    static create<TBase extends Class, T1 extends Class, T2 extends Class>(baseClass: TBase, class1: T1, class2: T2): Mixin & TBase & T1 & T2;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3): Mixin & TBase & T1 & T2 & T3;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class, T4 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4): Mixin & TBase & T1 & T2 & T3 & T4;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class, T4 extends Class, T5 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4, class5: T5): Mixin & TBase & T1 & T2 & T3 & T4 & T5;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class, T4 extends Class, T5 extends Class, T6 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4, class5: T5, class6: T6): Mixin & TBase & T1 & T2 & T3 & T4 & T5 & T6;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class, T4 extends Class, T5 extends Class, T6 extends Class, T7 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4, class5: T5, class6: T6, class7: T7): Mixin & TBase & T1 & T2 & T3 & T4 & T5 & T6 & T7;
    static create(baseClass: Class, ...mixinClasses:  Class[]): Mixin & Class {
        const result = new Mixin(baseClass, ...mixinClasses);
        applyMixins(result, baseClass, mixinClasses);

        return result;
    }

    private constructor(baseClass: Class, ...mixinClasses: Class[]) {
        super();

        this[$baseClass] = baseClass;
        this[$mixinClasses] = mixinClasses;
    }

    get baseClass(): Class { return this[$baseClass]; }
    get mixinClasses():  Class[] { return this[$mixinClasses]; }

    private [$baseClass]: Class;
    private [$mixinClasses]: Class[];
}

function applyMixins(result: any, baseClass: any, mixinClasses: any[]) {
    ObjectUtils.crudeCopy(baseClass.prototype, result.prototype);
    for (let mixinClass of mixinClasses)
        ObjectUtils.crudeCopy(mixinClass.prototype, result.prototype, false);
}