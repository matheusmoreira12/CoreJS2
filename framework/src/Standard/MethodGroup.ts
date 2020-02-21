export type MethodGroupInstance<TMethod1 extends Function, TMethod2 extends Function = any, TMethod3 extends Function = any, TMethod4 extends Function = any, TMethod5 extends Function = any, TMethod6 extends Function = any, TMethod7 extends Function = any, TMethod8 extends Function = any> = MethodGroup & TMethod1 & TMethod2 & TMethod3 & TMethod4 & TMethod5 & TMethod6 & TMethod7 & TMethod8;

export class MethodGroup {
    create<TMethod1 extends Function>(method1: TMethod1): MethodGroupInstance<TMethod1>;
    create<TMethod1 extends Function, TMethod2 extends Function>(method1: TMethod1, method2: TMethod2): MethodGroupInstance<TMethod1, TMethod2>;
    create<TMethod1 extends Function, TMethod2 extends Function, TMethod3 extends Function>(method1: TMethod1, method2: TMethod2, method3: TMethod3): MethodGroupInstance<TMethod1, TMethod2, TMethod3>;
    create<TMethod1 extends Function, TMethod2 extends Function, TMethod3 extends Function, TMethod4 extends Function>(method1: TMethod1, method2: TMethod2, method3: TMethod3, method4: TMethod4): MethodGroupInstance<TMethod1, TMethod2, TMethod3, TMethod4>;
    create<TMethod1 extends Function, TMethod2 extends Function, TMethod3 extends Function, TMethod4 extends Function, TMethod5 extends Function>(method1: TMethod1, method2: TMethod2, method3: TMethod3, method4: TMethod4, method5: TMethod5): MethodGroupInstance<TMethod1, TMethod2, TMethod3, TMethod4, TMethod5>;
    create<TMethod1 extends Function, TMethod2 extends Function, TMethod3 extends Function, TMethod4 extends Function, TMethod5 extends Function, TMethod6 extends Function>(method1: TMethod1, method2: TMethod2, method3: TMethod3, method4: TMethod4, method5: TMethod5, method6: TMethod6): MethodGroupInstance<TMethod1, TMethod2, TMethod3, TMethod4, TMethod5, TMethod6>;
    create<TMethod1 extends Function, TMethod2 extends Function, TMethod3 extends Function, TMethod4 extends Function, TMethod5 extends Function, TMethod6 extends Function, TMethod7 extends Function>(method1: TMethod1, method2: TMethod2, method3: TMethod3, method4: TMethod4, method5: TMethod5, method6: TMethod6, method7: TMethod7): MethodGroupInstance<TMethod1, TMethod2, TMethod3, TMethod4, TMethod5, TMethod6, TMethod7>;
    create<TMethod1 extends Function, TMethod2 extends Function, TMethod3 extends Function, TMethod4 extends Function, TMethod5 extends Function, TMethod6 extends Function, TMethod7 extends Function, TMethod8 extends Function>(method1: TMethod1, method2: TMethod2, method3: TMethod3, method4: TMethod4, method5: TMethod5, method6: TMethod6, method7: TMethod7, method8: TMethod8): MethodGroupInstance<TMethod1, TMethod2, TMethod3, TMethod4, TMethod5, TMethod6, TMethod7, TMethod8>;
    create(...methods: Function[]): MethodGroupInstance<Function> {
        const group = new MethodGroup();
        const func = function MethodGroup () {

        };
        Object.setPrototypeOf(group, Object.getPrototypeOf(func));
        Object.setPrototypeOf(func, group);
        return group;
    }
}

export interface MethodGroup extends Function {}