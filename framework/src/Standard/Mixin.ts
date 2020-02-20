import { ObjectUtils } from "../CoreBase/Utils/index";

const $baseClass = Symbol();
const $mixinClasses = Symbol();

type Class<T = any> = Function & { prototype: T };

type MixinInstance<TBase extends Class, T1 extends Class, T2 extends Class = any, T3 extends Class = any, T4 extends Class = any, T5 extends Class = any, T6 extends Class = any, T7 extends Class = any> = Mixin & TBase & T1 & T2 & T3 & T4 & T5 & T6 & T7;

export class Mixin extends Function {
    static create<TBase extends Class, T1 extends Class>(baseClass: TBase, class1: T1): MixinInstance<TBase, T1>;
    static create<TBase extends Class, T1 extends Class, T2 extends Class>(baseClass: TBase, class1: T1, class2: T2): MixinInstance<TBase, T1, T2>;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3): MixinInstance<TBase, T1, T2, T3>;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class, T4 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4): MixinInstance<TBase, T1, T2, T3, T4>;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class, T4 extends Class, T5 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4, class5: T5): MixinInstance<TBase, T1, T2, T3, T4, T5>;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class, T4 extends Class, T5 extends Class, T6 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4, class5: T5, class6: T6): MixinInstance<TBase, T1, T2, T3, T4, T5, T6>;
    static create<TBase extends Class, T1 extends Class, T2 extends Class, T3 extends Class, T4 extends Class, T5 extends Class, T6 extends Class, T7 extends Class>(baseClass: TBase, class1: T1, class2: T2, class3: T3, class4: T4, class5: T5, class6: T6, class7: T7): MixinInstance<TBase, T1, T2, T3, T4, T5, T6, T7>;
    static create(baseClass: Class, ...mixinClasses: Class[]): MixinInstance<Class, Class, Class, Class, Class, Class, Class, Class> {
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
    get mixinClasses(): Class[] { return this[$mixinClasses]; }

    private [$baseClass]: Class;
    private [$mixinClasses]: Class[];
}

function applyMixins(result: Mixin, baseClass: Class, mixinClasses: Class[]) {
    ObjectUtils.crudeCopy(baseClass.prototype, result.prototype);
    for (let mixinClass of mixinClasses)
        ObjectUtils.crudeCopy(mixinClass.prototype, result.prototype, false);
}