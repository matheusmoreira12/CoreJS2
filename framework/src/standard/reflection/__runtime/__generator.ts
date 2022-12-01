import { ArrayUtils, ObjectUtils } from "../../../core-base/utils/index.js";
import { InvalidOperationException } from "../../exceptions/index.js";
import { Guid } from "../../guids/index.js";
import { ConstructorInfo, MemberInfo, MethodInfo, ParameterInfo, PropertyInfo, Type } from "../index.js";
import { OutputArgument } from "../types.js";
import { __Factory } from "./__factory.js";
import { __Parser } from "./__parser.js";
import { __Registry } from "./__registry.js";

export module __Generator {
    export function createAllTypeMembers(targetClass: Function, targetInstance: any, declaringType: Type): IterableIterator<MemberInfo> {
        return ArrayUtils.concat(getStaticMembers(targetClass), getInstanceMembers(targetInstance)) as IterableIterator<MemberInfo>;

        function getInstanceMembers(t: any) {
            return ArrayUtils.select(getNamedPropertyDescriptorTuples(t), ([t, n, d]) => {
                const outMember: OutputArgument<MemberInfo> = {};
                if (!tryCreateTypeMember(t, declaringType, n as string, d, false, outMember))
                    throw new InvalidOperationException(`Cannot get member ${n} from type ${t.name}`);
                return outMember.value;
            });
        }

        function getStaticMembers(t: Function) {
            return ArrayUtils.select(getNamedPropertyDescriptorTuples(t), ([t, n, d]) => {
                const outMember: OutputArgument<MemberInfo> = {};
                if (!tryCreateTypeMember(t, declaringType, n as string, d, true, outMember))
                    throw new InvalidOperationException(`Cannot get static member ${n} from type ${t.name}`);
                return outMember.value;
            })
        }

        function getNamedPropertyDescriptorTuples<T>(t: T) {
            return ArrayUtils.where(ObjectUtils.getAllPropertyDescriptorsAsTuples(t), ([, k,]) => typeof k == "string") as IterableIterator<[T, keyof T & string, PropertyDescriptor]>;
        }
    }

    function tryCreateTypeMember(target: any, declaringType: Type, name: string, descriptor: PropertyDescriptor, isStatic: boolean, outMember: OutputArgument<MemberInfo>): boolean {
        const isProperty = "get" in descriptor || "set" in descriptor;
        if (isProperty)
            return tryCreateProperty(target, declaringType, name, descriptor.get, descriptor.set, isStatic, outMember as OutputArgument<PropertyInfo>);
        const value = descriptor.value;
        const isFunction = typeof value == "function";
        if (isFunction) {
            const isConstructor = name == "constructor";
            if (isConstructor)
                return tryCreateConstructor(target, declaringType, value, outMember as OutputArgument<ConstructorInfo>);
            return tryCreateMethod(target, declaringType, name, value, isStatic, outMember as OutputArgument<MethodInfo>);
        }
        return tryCreatePropertyForField(target, declaringType, name, isStatic, outMember as OutputArgument<PropertyInfo>);
    }

    function tryCreateConstructor(target: any, declaringType: Type, body: Function, outConstructor: OutputArgument<ConstructorInfo>): boolean {
        const constructor = new ConstructorInfo();
        const outId: OutputArgument<Guid> = {};
        if (!__Registry.tryRegisterConstructor(constructor, target, declaringType, outId))
            return false;
        constructor.__id = outId.value!;
        const outParameters: OutputArgument<ParameterInfo[]> = {};
        if (!__Parser.tryParseMethodParameters(constructor, body.toString(), outParameters))
            return false;
        outConstructor.value = constructor;
        return true;
    }

    function tryCreateMethod(target: any, declaringType: Type, name: string, body: Function, isStatic: boolean, outMethod: OutputArgument<ConstructorInfo>): boolean {
        const method = new MethodInfo();
        const outId: OutputArgument<Guid> = {};
        if (!__Registry.tryRegisterMethod(method, target, declaringType, name, body, isStatic, outId))
            return false;
        method.__id = outId.value!;
        const outParameters: OutputArgument<ParameterInfo[]> = {};
        if (!__Parser.tryParseMethodParameters(method, body.toString(), outParameters))
            return false;
        outMethod.value = method;
        return true;
    }

    function tryCreatePropertyForField(target: any, declaringType: Type, name: string, isStatic: boolean, outProperty: OutputArgument<PropertyInfo>): boolean {
        const getter = __Factory.createFieldGetter(name);
        const setter = __Factory.createFieldSetter(name);
        return tryCreateProperty(target, declaringType, name, getter, setter, isStatic, outProperty);
    }

    function tryCreateProperty(target: any, declaringType: Type, name: string, getter: (() => any) | undefined, setter: ((value: any) => void) | undefined, isStatic: boolean, outProperty: OutputArgument<PropertyInfo>): boolean {
        let getterMethod: MethodInfo | null = null;
        if (getter) {
            const outGetterMethod: OutputArgument<MethodInfo> = {};
            if (!tryCreateMethod(target, declaringType, `__get_${name}`, getter, isStatic, outGetterMethod))
                return false;
            getterMethod = outGetterMethod.value!;
        }
        let setterMethod: MethodInfo | null = null;
        if (setter) {
            const outGetterMethod: OutputArgument<MethodInfo> = {};
            if (!tryCreateMethod(target, declaringType, `__set_${name}`, setter, isStatic, outGetterMethod))
                return false;
            setterMethod = outGetterMethod.value!;
        }
        const property = new PropertyInfo();
        const outId: OutputArgument<Guid> = {};
        if (!__Registry.tryRegisterProperty(property, target, declaringType, getterMethod, setterMethod, isStatic, outId))
            return false;
        property.__id = outId.value!;
        outProperty.value = property;
        return true;
    }
}
