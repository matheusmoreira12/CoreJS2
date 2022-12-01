import { ArrayUtils, ObjectUtils } from "../../../core-base/utils/index.js";
import { Guid } from "../../guids/index.js";
import { ConstructorInfo, MemberInfo, MethodInfo, MethodInfoBase, ParameterInfo, PropertyInfo, Type } from "../index.js";
import { AnyConstraint } from "../type-constraints/any-constraint.js";
import { OutputArgument } from "../types.js";
import { __Factory } from "./__factory.js";
import { __Parser } from "./__parser.js";
import { __Registry } from "./__registry.js";

export module __Generator {
    export function tryCreateAllTypeMembers(declaringType: Type, ctor: Function | null, hasCtor: boolean, ref: any, hasRef: boolean, outMembers: OutputArgument<MemberInfo[]>) {
        let hasFailed = false;
        const members = generate();
        if (hasFailed)
            return false;
        outMembers.value = [...members];
        return true;

        function generate() {
            return ArrayUtils.concat(getStaticMembers(), getInstanceMembers());

            function* getInstanceMembers() {
                if (!hasRef)
                    return;

                yield* ArrayUtils.select(getNamedPropertyDescriptorTuples(ref), ([, n, d]) => {
                    const outMember: OutputArgument<MemberInfo> = {};
                    if (!tryCreateTypeMember(declaringType, n as string, d, false, outMember))
                        hasFailed = true;
                    return outMember.value!;
                });
            }

            function* getStaticMembers() {
                if (!hasCtor)
                    return;

                yield* ArrayUtils.select(getNamedPropertyDescriptorTuples(ctor), ([, n, d]) => {
                    const outMember: OutputArgument<MemberInfo> = {};
                    if (!tryCreateTypeMember(declaringType, n as string, d, true, outMember))
                        hasFailed = true;
                    return outMember.value!;
                })
            }

            function getNamedPropertyDescriptorTuples<T>(t: T) {
                return ArrayUtils.where(ObjectUtils.getAllPropertyDescriptorsAsTuples(t), ([, k,]) => typeof k == "string") as IterableIterator<[T, keyof T & string, PropertyDescriptor]>;
            }
        }
    }

    function tryCreateTypeMember(declaringType: Type, name: string, descriptor: PropertyDescriptor, isStatic: boolean, outMember: OutputArgument<MemberInfo>): boolean {
        const isProperty = "get" in descriptor || "set" in descriptor;
        if (isProperty)
            return tryCreateProperty(declaringType, name, descriptor.get, descriptor.set, isStatic, outMember as OutputArgument<PropertyInfo>);
        const value = descriptor.value;
        const isFunction = typeof value == "function";
        if (isFunction) {
            const isConstructor = name == "constructor";
            if (isConstructor)
                return tryCreateConstructor(declaringType, value, outMember as OutputArgument<ConstructorInfo>);
            return tryCreateMethod(declaringType, name, value, isStatic, outMember as OutputArgument<MethodInfo>);
        }
        return tryCreatePropertyForField(declaringType, name, isStatic, outMember as OutputArgument<PropertyInfo>);
    }

    function tryCreateConstructor(declaringType: Type, body: Function, outConstructor: OutputArgument<ConstructorInfo>): boolean {
        const constructor = new ConstructorInfo();
        if (!__Registry.tryRegisterConstructor(constructor, declaringType, body, false))
            return false;
        const outParameters: OutputArgument<ParameterInfo[]> = {};
        if (!__Parser.tryParseMethodParameters(constructor, body.toString(), outParameters))
            return false;
        outConstructor.value = constructor;
        return true;
    }

    function tryCreateMethod(declaringType: Type, name: string, body: Function, isStatic: boolean, outMethod: OutputArgument<ConstructorInfo>): boolean {
        const method = new MethodInfo();
        const outId: OutputArgument<Guid> = {};
        if (!__Registry.tryRegisterMethod(method, declaringType, name, new AnyConstraint(), body, isStatic))
            return false;
        method.__id = outId.value!;
        outMethod.value = method;
        return true;
    }

    function tryCreatePropertyForField(declaringType: Type, name: string, isStatic: boolean, outProperty: OutputArgument<PropertyInfo>): boolean {
        const getter = __Factory.createFieldGetter(name);
        const setter = __Factory.createFieldSetter(name);
        return tryCreateProperty(declaringType, name, getter, setter, isStatic, outProperty);
    }

    function tryCreateProperty(declaringType: Type, name: string, getter: (() => any) | undefined, setter: ((value: any) => void) | undefined, isStatic: boolean, outProperty: OutputArgument<PropertyInfo>): boolean {
        let getterMethod: MethodInfo | null = null;
        if (getter) {
            const outGetterMethod: OutputArgument<MethodInfo> = {};
            if (!tryCreateMethod(declaringType, `__get_${name}`, getter, isStatic, outGetterMethod))
                return false;
            getterMethod = outGetterMethod.value!;
        }
        let setterMethod: MethodInfo | null = null;
        if (setter) {
            const outGetterMethod: OutputArgument<MethodInfo> = {};
            if (!tryCreateMethod(declaringType, `__set_${name}`, setter, isStatic, outGetterMethod))
                return false;
            setterMethod = outGetterMethod.value!;
        }
        const property = new PropertyInfo();
        const outId: OutputArgument<Guid> = {};
        if (!__Registry.tryRegisterProperty(property, declaringType, name, new AnyConstraint(), getterMethod, setterMethod, isStatic))
            return false;
        property.__id = outId.value!;
        outProperty.value = property;
        return true;
    }

    export function tryCreateParameters(declaringMethod: MethodInfoBase, body: Function, outParams: OutputArgument<ParameterInfo[]>) {
        return __Parser.tryParseMethodParameters(declaringMethod, body.toString(), outParams);
    }
}
