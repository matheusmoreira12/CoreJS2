import { ArrayUtils } from "../../../core-base/utils/index.js";
import { MemberInfo, Type } from "../index.js";
import { __Generator } from "./__generator.js";

export namespace __Registry {
    export function getMembers(targetClass: Function, targetInstance: any, declaringType: Type): IterableIterator<MemberInfo> {
        return ArrayUtils.concat(getStaticMembers(targetClass), getInstanceMembers(targetInstance));

        function getInstanceMembers(t: any) {
            return ArrayUtils.select(getNamedPropertyDescriptorTuples(t), ([t, n, d]) => __Generator.createAndRegisterMember(t, declaringType, n as string, d, false))
        }

        function getStaticMembers(t: Function) {
            return ArrayUtils.select(getNamedPropertyDescriptorTuples(t), ([t, n, d]) => createAndRegisterMember(t, declaringType, n as string, d, true))
        }

        function getNamedPropertyDescriptorTuples<T>(t: T) {
            return ArrayUtils.where(ObjectUtils.getAllPropertyDescriptorsAsTuples(t), ([, k,]) => typeof k == "string");
        }

        function createMember(target: any, declaringType: Type, name: string, descriptor: PropertyDescriptor, isStatic: boolean): MemberInfo {
            const isProperty = "get" in descriptor || "set" in descriptor;
            if (isProperty)
                return __Generator.tryCreateProperty(target, declaringType, name, descriptor.get, descriptor.set, isStatic);
            const isFunction = descriptor.value instanceof Function;
            if (isFunction) {
                const isConstructor = name == "constructor";
                if (isConstructor)
                    return __Generator.tryCreateConstructor(target, declaringType);
                return __Generator.tryCreateMethod(target, declaringType, name, descriptor.value, isStatic);
            }
            return __Generator.tryCreatePropertyForField(target, declaringType, name, isStatic);
        }
    }
}