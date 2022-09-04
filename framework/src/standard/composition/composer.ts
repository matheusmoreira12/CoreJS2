import { ObjectUtils, StringUtils } from "../../core-base/utils/index.js";
import { assertEachParams, assertParams } from "../../validation/index.js";
import { ArgumentException } from "../exceptions/index.js";
import { Type } from "../reflection/index.js";
import { Composable } from "./index.js";
import { CompositionBase } from "./index.js";

type ConstructibleComposableClass = (new () => Composable) & Composable;
type Properties<T> = { [P in keyof T]: T[P] }
type CompositionProperties<T> = T extends [infer THead, ...infer TTail] ? Readonly<Properties<THead>> & CompositionProperties<TTail> : unknown;
type Composition<T> = new () => CompositionBase & CompositionProperties<T>;

export namespace Composer {
    export function compose<T extends ConstructibleComposableClass[]>(...ctors: T): Composition<T> {
        assertEachParams({ ctors }, [Function]);

        validateComposables(StringUtils.nameOf({ ctors }), ctors);

        const compositionClass = compositionClass_factory(ctors);
        return compositionClass as Composition<T>;
    }
}

function validateComposables(argName: string, ctors: ConstructibleComposableClass[]) {
    ctors.forEach((c, i) => {
        const argItemName = `${argName}[${i}]`;

        if (c === Composable)
            throw new ArgumentException(argItemName, "Cannot compose with class Composable itself.");

        const cType = Type.get(c);
        if (!cType.directlyExtends(Type.get(Composable)))
            throw new ArgumentException(argItemName, `Cannot compose with the specified class. Class ${cType.name} does not directly extend class Composable.`);
    });
}

function compositionClass_factory<T extends ConstructibleComposableClass[]>(ctors: T): Composition<T> {
    const composedClassName = generateComposedClassName(ctors);
    const composedClass = new Function("CompositionBase", "initializeAllComposedClasses", `return class ${composedClassName} extends CompositionBase { constructor() { super(); initializeAllComposedClasses.call(this); } }`)(CompositionBase, initializeAllComposedClasses) as Composition<T>;

    for (let ctor of ctors)
        reflectProperties(getInstanceFieldName(ctor), ctor.prototype, composedClass.prototype);

    return composedClass;

    function initializeAllComposedClasses(this: Composition<T>) {
        for (let ctor of ctors) {
            const composedInstance = new ctor();
            const instanceFieldKey = getInstanceFieldName(ctor);
            Object.defineProperty(this, getInstanceFieldName(ctor), {
                get() { return composedInstance }
            });
            reflectProperties(instanceFieldKey, composedInstance, this);
        }
    }

    function reflectProperties<TSource extends object, TTarget extends object>(instanceFieldKey: string | symbol, sourceObj: TSource, targetObj: TTarget) {
        for (let prop of ObjectUtils.getAllPropertyKeys(sourceObj)) {
            if (Object.hasOwn(targetObj, prop))
                continue;

            Object.defineProperty(targetObj, prop, {
                get(this: TTarget) {
                    return (this[instanceFieldKey as keyof TTarget] as TSource)[prop as keyof TSource];
                },
                set(this: TTarget, value: any) {
                    (this[instanceFieldKey as keyof TTarget] as TSource)[prop as keyof TSource] = value;
                }
            });
        }
    }

    function generateComposedClassName(ctors: ConstructibleComposableClass[]) {
        return `${ctors.map(c => c.name).join("_")}_Composition`;
    }

    function getInstanceFieldName(ctor: ConstructibleComposableClass) {
        return `__${ctor.name}_instance`;
    }
}
