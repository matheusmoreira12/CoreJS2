import { Guid } from "../../guids/index.js";
import { ConstructorInfo, MemberInfo, MemberKind, MethodInfo, MethodInfoBase, ParameterInfo, PropertyInfo, Type } from "../index.js";
import { TypeConstraint } from "../type-constraints/index.js";
import { OutputArgument } from "../types.js";
import { __Generator } from "./__generator.js";

type OnlyProperties<T> = {
    [P in keyof T as P extends (symbol | `_${string}`) ? never : T[P] extends Function ? never : P]: T[P];
}

export module __Registry {
    interface RegistryData {
        id: Guid;
        isType: boolean;
        isMemberInfo: boolean;
        isConstructorInfo: boolean;
        isMethodInfo: boolean;
        isPropertyInfo: boolean;
        isParameterInfo: boolean;
    }

    interface TypeData extends RegistryData, OnlyProperties<Type> {
        id: Guid;
        isType: true;
        hasComputedBaseType: boolean;
        hasComputedMembers: boolean;
        instance: any;
        hasInstance: boolean;
        class: Function;
        hasClass: boolean;
    }

    interface MemberInfoData extends RegistryData, OnlyProperties<MemberInfo> {
        id: Guid;
        isMemberInfo: true;
    }

    interface MethodInfoBaseData extends MemberInfoData, OnlyProperties<MethodInfoBase> {
        id: Guid;
        body: Function;
    }

    interface ConstructorInfoData extends MethodInfoBaseData, OnlyProperties<ConstructorInfo> {
        id: Guid;
        body: Function;
        isConstructorInfo: true;
    }

    interface MethodInfoData extends MethodInfoBaseData, OnlyProperties<MethodInfo> {
        id: Guid;
        body: Function;
        isMethodInfo: true;
    }

    interface PropertyInfoData extends MemberInfoData, OnlyProperties<PropertyInfo> {
        id: Guid;
        isPropertyInfo: true;
    }

    interface ParameterInfoData extends RegistryData, OnlyProperties<ParameterInfo> {
        id: Guid;
        isParameterInfo: true;
    }

    const registeredData: RegistryData[] = [];
    namespace TypeData {
        export function create(name: string, instance: any, hasInstance: boolean, clas: any, hasClass: boolean): TypeData {
            return {
                id: Guid.createUnique(),
                isType: true,
                isMemberInfo: false,
                isConstructorInfo: false,
                isMethodInfo: false,
                isPropertyInfo: false,
                isParameterInfo: false,
                baseType: null,
                hasComputedBaseType: false,
                allMembers: [],
                hasComputedMembers: false,
                name,
                instance,
                hasInstance,
                class: clas,
                hasClass
            };
        }

        export function tryRegister(data: TypeData): boolean {
            const isAlreadyRegistered = registeredData.some(i => i.isType && classMatches(i as TypeData) || instanceMatches(i as TypeData));
            if (isAlreadyRegistered)
                return false;
            registeredData.push(data);
            return true;

            function classMatches(t: TypeData) {
                return !data.hasClass && !t.hasClass ||
                    data.hasClass && t.hasClass && (t.class === data.class);
            }

            function instanceMatches(t: TypeData) {
                return !data.hasInstance && !t.hasInstance ||
                    data.hasInstance && t.hasInstance && (t.instance === data.instance);
            }
        }
    }

    namespace MemberInfoData {
        export function tryRegister(data: MemberInfoData): boolean {
            const isAlreadyRegistered = registeredData.some(i => i.isMemberInfo && staticityMatches(i as MemberInfoData) && nameMatches(i as MemberInfoData) && declaringTypeMatches(i as MemberInfoData));
            if (isAlreadyRegistered)
                return false;
            registeredData.push(data);
            return true;

            function staticityMatches(m: MemberInfoData) {
                return m.isStatic == data.isStatic;
            }

            function nameMatches(m: MemberInfoData) {
                return m.name == data.name;
            }

            function declaringTypeMatches(m: MemberInfoData) {
                return !data.declaringType && !m.declaringType ||
                    data.declaringType && m.declaringType && m.declaringType.equals(data.declaringType);
            }
        }
    }

    namespace ConstructorInfoData {
        export function create(declaringType: Type, name: string, parameters: ParameterInfo[], body: Function, isStatic: boolean): ConstructorInfoData {
            return {
                id: Guid.createUnique(),
                isType: false,
                isMemberInfo: true,
                isConstructorInfo: true,
                isMethodInfo: false,
                isPropertyInfo: false,
                isParameterInfo: false,
                memberKind: MemberKind.Constructor,
                declaringType,
                name,
                parameters,
                body,
                isStatic,
            };
        }

        export function tryRegister(data: ConstructorInfoData): boolean {
            return MemberInfoData.tryRegister(data);
        }
    }

    namespace MethodInfoData {
        export function create(declaringType: Type, name: string, parameters: ParameterInfo[], returnType: TypeConstraint, body: Function, isStatic: boolean): MethodInfoData {
            return {
                id: Guid.createUnique(),
                isType: false,
                isMemberInfo: true,
                isConstructorInfo: false,
                isMethodInfo: true,
                isPropertyInfo: false,
                isParameterInfo: false,
                memberKind: MemberKind.Method,
                declaringType,
                name,
                parameters,
                returnType,
                body,
                isStatic,
            };
        }

        export function tryRegister(data: MethodInfoData): boolean {
            return MemberInfoData.tryRegister(data);
        }
    }

    namespace PropertyInfoData {
        export function create(declaringType: Type, name: string, type: TypeConstraint, isStatic: boolean, getMethod: MethodInfo | null, setMethod: MethodInfo | null): PropertyInfoData {
            return {
                id: Guid.createUnique(),
                isType: false,
                isMemberInfo: true,
                isConstructorInfo: false,
                isMethodInfo: false,
                isPropertyInfo: true,
                isParameterInfo: false,
                memberKind: MemberKind.Method,
                declaringType,
                name,
                type,
                isStatic,
                getMethod,
                setMethod,
            };
        }

        export function tryRegister(data: PropertyInfoData): boolean {
            return MemberInfoData.tryRegister(data);
        }
    }

    namespace ParameterInfoData {
        export function create(declaringMethod: MethodInfo, position: number, name: string, parameterKind: number, type: TypeConstraint, isOptional: boolean): ParameterInfoData {
            return {
                id: Guid.createUnique(),
                isType: false,
                isMemberInfo: true,
                isConstructorInfo: false,
                isMethodInfo: false,
                isPropertyInfo: false,
                isParameterInfo: true,
                declaringMethod,
                position,
                name,
                parameterKind,
                type,
                isOptional,
            };
        }

        export function tryRegister(data: ParameterInfoData): boolean {
            const isAlreadyRegistered = registeredData.some(i => i.isMemberInfo && nameMatches(i as ParameterInfoData) && declaringMethodMatches(i as ParameterInfoData));
            if (isAlreadyRegistered)
                return false;
            registeredData.push(data);
            return true;

            function declaringMethodMatches(m: ParameterInfoData) {
                return m.declaringMethod.equals(data.declaringMethod);
            }

            function nameMatches(m: ParameterInfoData) {
                return m.name == data.name;
            }
        }
    }

    export function tryRegisterConstructor(constructor: ConstructorInfo, instance: any, declaringType: Type, parameters: ParameterInfo[], body: Function, isStatic: boolean): boolean {
        const data = ConstructorInfoData.create(declaringType, instance, parameters, body, isStatic);
        if (!ConstructorInfoData.tryRegister(data))
            return false;
        constructor.__id = data.id;
        return true;
    }

    export function tryRegisterMethod(method: MethodInfo, declaringType: Type, name: string, parameters: ParameterInfo[], returnType: TypeConstraint, body: Function, isStatic: boolean): boolean {
        const data = MethodInfoData.create(declaringType, name, parameters, returnType, body, isStatic);
        if (!MethodInfoData.tryRegister(data))
            return false;
        method.__id = data.id;
        return true;
    }

    export function tryRegisterProperty(property: PropertyInfo, declaringType: Type, name: string, type: TypeConstraint, getMethod: MethodInfo | null, setMethod: MethodInfo | null, isStatic: boolean): boolean {
        const data = PropertyInfoData.create(declaringType, name, type, isStatic, getMethod, setMethod);
        if (!PropertyInfoData.tryRegister(data))
            return false;
        property.__id = data.id;
        return true;
    }

    export function tryRegisterParameter(parameter: ParameterInfo, declaringMethod: MethodInfo, position: number, name: string, parameterKind: number, type: TypeConstraint, isOptional: boolean): boolean {
        const data = ParameterInfoData.create(declaringMethod, position, name, parameterKind, type, isOptional);
        if (!ParameterInfoData.tryRegister(data))
            return false;
        parameter.__id = data.id;
        return true;
    }

    export function tryGetTypeFromClass(clas: Function, outType: OutputArgument<Type>): boolean {
        const data = registeredData.find(d => d.isType && classMatches(d as TypeData));
        if (!data)
            return false;
        const type = new Type();
        type.__id = (data as TypeData).id;
        outType.value = type;
        return true;

        function classMatches(t: TypeData) {
            return t.hasClass && t.class === clas;
        }
    }

    export function tryGetTypeFromInstance(instance: any, outType: OutputArgument<Type>): boolean {
        const data = registeredData.find(d => d.isType && instanceMatches(d as TypeData));
        if (!data)
            return false;
        const type = new Type();
        type.__id = (data as TypeData).id;
        outType.value = type;
        return true;

        function instanceMatches(t: TypeData) {
            return t.hasInstance && t.instance === instance;
        }
    }

    export function tryGetAllTypeMembers(type: Type, outAllMembers: OutputArgument<MemberInfo[]>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(type.id, outData))
            return false;
        outAllMembers.value = [...(outData.value as TypeData)!.allMembers];
        return true;
    }

    export function tryGetTypeBaseType(type: Type, outBaseType: OutputArgument<Type | null>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(type.id, outData))
            return false;
        outBaseType.value = (outData.value! as TypeData).baseType;
        return true;
    }

    export function tryGetTypeName(type: Type, outName: OutputArgument<string>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(type.id, outData))
            return false;
        outName.value = (outData.value! as TypeData).name;
        return true;
    }

    export function tryGetMemberInfoMemberKind(member: MemberInfo, outMemberKind: OutputArgument<number>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(member.id, outData))
            return false;
        outMemberKind.value = (outData.value! as MemberInfoData).memberKind;
        return true;
    }

    export function tryGetMemberInfoName(member: MemberInfo, outName: OutputArgument<string>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(member.id, outData))
            return false;
        outName.value = (outData.value! as MemberInfoData).name;
        return true;
    }

    export function tryGetMemberInfoDeclaringType(member: MemberInfo, outDeclaringType: OutputArgument<Type | null>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(member.id, outData))
            return false;
        outDeclaringType.value = (outData.value! as MemberInfoData).declaringType;
        return true;
    }

    export function tryGetMemberInfoIsStatic(member: MemberInfo, outIsStatic: OutputArgument<boolean>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(member.id, outData))
            return false;
        outIsStatic.value = (outData.value! as MemberInfoData).isStatic;
        return true;
    }

    export function tryGetMethodInfoBaseParameters(method: MethodInfoBase, outParameters: OutputArgument<ParameterInfo[]>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(method.id, outData))
            return false;
        outParameters.value = (outData.value! as MethodInfoBaseData).parameters;
        return true;
    }

    export function tryGetMethodInfoBaseBody(method: MethodInfoBase, outBody: OutputArgument<Function>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(method.id, outData))
            return false;
        outBody.value = (outData.value! as MethodInfoBaseData).body;
        return true;
    }

    export function tryGetMethodInfoReturnType(method: MethodInfo, outReturnType: OutputArgument<TypeConstraint>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(method.id, outData))
            return false;
        outReturnType.value = (outData.value! as MethodInfoData).returnType;
        return true;
    }

    export function tryGetPropertyInfoGetMethod(property: PropertyInfo, outGetMethod: OutputArgument<MethodInfo | null>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(property.id, outData))
            return false;
        outGetMethod.value = (outData.value! as PropertyInfoData).getMethod;
        return true;
    }

    export function tryGetPropertyInfoSetMethod(property: PropertyInfo, outSetMethod: OutputArgument<MethodInfo | null>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(property.id, outData))
            return false;
        outSetMethod.value = (outData.value! as PropertyInfoData).setMethod;
        return true;
    }

    export function tryGetPropertyInfoType(property: PropertyInfo, outType: OutputArgument<TypeConstraint>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(property.id, outData))
            return false;
        outType.value = (outData.value! as PropertyInfoData).type;
        return true;
    }

    export function tryGetParameterInfoDeclaringMethod(parameter: ParameterInfo, outDeclaringMethod: OutputArgument<MethodInfo>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(parameter.id, outData))
            return false;
        outDeclaringMethod.value = (outData.value! as ParameterInfoData).declaringMethod;
        return true;
    }

    export function tryGetParameterInfoPosition(parameter: ParameterInfo, outPosition: OutputArgument<number>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(parameter.id, outData))
            return false;
        outPosition.value = (outData.value! as ParameterInfoData).position;
        return true;
    }

    export function tryGetParameterInfoName(parameter: ParameterInfo, outName: OutputArgument<string>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(parameter.id, outData))
            return false;
        outName.value = (outData.value! as ParameterInfoData).name;
        return true;
    }

    export function tryGetParameterInfoParameterKind(parameter: ParameterInfo, outParameterKind: OutputArgument<number>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(parameter.id, outData))
            return false;
        outParameterKind.value = (outData.value! as ParameterInfoData).parameterKind;
        return true;
    }

    export function tryGetParameterInfoType(parameter: ParameterInfo, outType: OutputArgument<TypeConstraint>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(parameter.id, outData))
            return false;
        outType.value = (outData.value! as ParameterInfoData).type;
        return true;
    }

    export function tryGetParameterInfoIsOptional(parameter: ParameterInfo, outIsOptional: OutputArgument<boolean>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(parameter.id, outData))
            return false;
        outIsOptional.value = (outData.value! as ParameterInfoData).isOptional;
        return true;
    }

    function tryGetRegistryData(id: Guid, outData: OutputArgument<RegistryData>): boolean {
        const data = registeredData.find(d => d.id.equals(id));
        if (!data)
            return false;
        outData.value = data as MemberInfoData;
        return true;
    }
}