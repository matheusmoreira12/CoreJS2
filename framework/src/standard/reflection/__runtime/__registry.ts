import { Guid } from "../../guids/index.js";
import { ConstructorInfo, MemberInfo, MemberKind, MethodInfo, MethodInfoBase, ParameterInfo, PropertyInfo, Type } from "../index.js";
import { TypeConstraint } from "../type-constraints/index.js";
import { __Generator } from "./__generator.js";
import type { OutputArgument } from "../types.js";
import { __Parser } from "./__parser.js";

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

    namespace RegistryData {
        export function tryGet(id: Guid, outData: OutputArgument<RegistryData>): boolean {
            const data = registeredData.find(d => d.id.equals(id));
            if (!data)
                return false;
            outData.value = data;
            return true;
        }
    }

    interface TypeData extends RegistryData {
        isType: true;
        name: string;
        baseType: null;
        hasEvaluatedBaseType: boolean;
        ctor: Function | null | undefined;
        allMembers: MemberInfo[] | null;
        hasEvaluatedAllMembers: boolean;
    }

    namespace TypeData {
        export function create(name: string, ctor: any): TypeData {
            return {
                id: Guid.create(),
                isType: true,
                isMemberInfo: false,
                isConstructorInfo: false,
                isMethodInfo: false,
                isPropertyInfo: false,
                isParameterInfo: false,
                baseType: null,
                hasEvaluatedBaseType: false,
                name,
                ctor,
                allMembers: null,
                hasEvaluatedAllMembers: false,
            };
        }

        export function tryRegister(type: Type, data: TypeData): boolean {
            const isAlreadyRegistered = registeredData.some(i => i.isType && ctorMatches(i as TypeData));
            if (isAlreadyRegistered)
                return false;
            type.__id = data.id;
            registeredData.push(data);
            return true;

            function ctorMatches(t: TypeData) {
                return t.ctor === data.ctor;
            }
        }
    }

    interface MemberInfoData extends RegistryData {
        isMemberInfo: true;
        declaringType: Type,
        name: string;
        memberKind: number;
        isStatic: boolean;
    }

    namespace MemberInfoData {
        export function tryRegister(member: MemberInfo, data: MemberInfoData): boolean {
            const isAlreadyRegistered = registeredData.some(i => i.isMemberInfo && staticityMatches(i as MemberInfoData) && nameMatches(i as MemberInfoData) && declaringTypeMatches(i as MemberInfoData));
            if (isAlreadyRegistered)
                return false;
            member.__id = data.id;
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
                    data.declaringType && m.declaringType && m.declaringType.id.equals(data.declaringType.id);
            }
        }
    }

    interface MethodInfoBaseData extends MemberInfoData {
        body: Function;
        parameters: ParameterInfo[] | null;
        hasEvaluatedParameters: boolean;
    }

    interface ConstructorInfoData extends MethodInfoBaseData {
        isConstructorInfo: true;
    }

    namespace ConstructorInfoData {
        export function create(declaringType: Type, name: string, body: Function, isStatic: boolean): ConstructorInfoData {
            return {
                id: Guid.create(),
                isType: false,
                isMemberInfo: true,
                isConstructorInfo: true,
                isMethodInfo: false,
                isPropertyInfo: false,
                isParameterInfo: false,
                memberKind: MemberKind.Constructor,
                declaringType,
                name,
                body,
                isStatic,
                parameters: null,
                hasEvaluatedParameters: false,
            };
        }

        export function tryRegister(ctor: ConstructorInfo, data: ConstructorInfoData): boolean {
            return MemberInfoData.tryRegister(ctor, data);
        }
    }

    interface MethodInfoData extends MethodInfoBaseData {
        isMethodInfo: true;
        returnType: TypeConstraint;
    }

    namespace MethodInfoData {
        export function create(declaringType: Type, name: string, returnType: TypeConstraint, body: Function, isStatic: boolean): MethodInfoData {
            return {
                id: Guid.create(),
                isType: false,
                isMemberInfo: true,
                isConstructorInfo: false,
                isMethodInfo: true,
                isPropertyInfo: false,
                isParameterInfo: false,
                memberKind: MemberKind.Method,
                declaringType,
                name,
                returnType,
                body,
                isStatic,
                parameters: null,
                hasEvaluatedParameters: false,
            };
        }

        export function tryRegister(method: MethodInfo, data: MethodInfoData): boolean {
            return MemberInfoData.tryRegister(method, data);
        }
    }

    interface PropertyInfoData extends MemberInfoData {
        isPropertyInfo: true;
        type: TypeConstraint;
        getMethod: MethodInfo | null;
        setMethod: MethodInfo | null;
    }

    namespace PropertyInfoData {
        export function create(declaringType: Type, name: string, type: TypeConstraint, isStatic: boolean, getMethod: MethodInfo | null, setMethod: MethodInfo | null): PropertyInfoData {
            return {
                id: Guid.create(),
                isType: false,
                isMemberInfo: true,
                isConstructorInfo: false,
                isMethodInfo: false,
                isPropertyInfo: true,
                isParameterInfo: false,
                memberKind: MemberKind.Property,
                declaringType,
                name,
                type,
                isStatic,
                getMethod,
                setMethod,
            };
        }

        export function tryRegister(prop: PropertyInfo, data: PropertyInfoData): boolean {
            return MemberInfoData.tryRegister(prop, data);
        }
    }

    interface ParameterInfoData extends RegistryData {
        isParameterInfo: true;
        declaringMethod: MethodInfo;
        position: number;
        name: string;
        type: TypeConstraint;
        parameterKind: number;
        isOptional: boolean;
    }

    namespace ParameterInfoData {
        export function create(declaringMethod: MethodInfo, position: number, name: string, parameterKind: number, type: TypeConstraint, isOptional: boolean): ParameterInfoData {
            return {
                id: Guid.create(),
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

        export function tryRegister(param: ParameterInfo, data: ParameterInfoData): boolean {
            const isAlreadyRegistered = registeredData.some(i => i.isMemberInfo && nameMatches(i as ParameterInfoData) && declaringMethodMatches(i as ParameterInfoData));
            if (isAlreadyRegistered)
                return false;
            param.__id = data.id;
            registeredData.push(data);
            return true;

            function declaringMethodMatches(m: ParameterInfoData) {
                return m.declaringMethod.id.equals(data.declaringMethod.id);
            }

            function nameMatches(m: ParameterInfoData) {
                return m.name == data.name;
            }
        }
    }

    const registeredData: RegistryData[] = [];

    export function tryRegisterConstructor(constructor: ConstructorInfo, declaringType: Type, body: Function, isStatic: boolean): boolean {
        const data = ConstructorInfoData.create(declaringType, "constructor", body, isStatic);
        if (!ConstructorInfoData.tryRegister(constructor, data))
            return false;
        return true;
    }

    export function tryRegisterMethod(method: MethodInfo, declaringType: Type, name: string, returnType: TypeConstraint, body: Function, isStatic: boolean): boolean {
        const data = MethodInfoData.create(declaringType, name, returnType, body, isStatic);
        if (!MethodInfoData.tryRegister(method, data))
            return false;
        return true;
    }

    export function tryRegisterProperty(property: PropertyInfo, declaringType: Type, name: string, type: TypeConstraint, getMethod: MethodInfo | null, setMethod: MethodInfo | null, isStatic: boolean): boolean {
        const data = PropertyInfoData.create(declaringType, name, type, isStatic, getMethod, setMethod);
        if (!PropertyInfoData.tryRegister(property, data))
            return false;
        return true;
    }

    export function tryRegisterParameter(parameter: ParameterInfo, declaringMethod: MethodInfo, position: number, name: string, parameterKind: number, type: TypeConstraint, isOptional: boolean): boolean {
        const data = ParameterInfoData.create(declaringMethod, position, name, parameterKind, type, isOptional);
        if (!ParameterInfoData.tryRegister(parameter, data))
            return false;
        return true;
    }

    export function tryGetTypeFromConstructor(ctor: Function, outType: OutputArgument<Type>): boolean {
        return tryFind() || tryCreate();

        function tryFind() {
            const data = registeredData.find(d => d.isType && ctorMatches(d as TypeData));
            if (!data)
                return false;
            const type = new Type();
            type.__id = (data as TypeData).id;
            outType.value = type;
            return true;

            function ctorMatches(t: TypeData) {
                return t.ctor === ctor;
            }
        }

        function tryCreate() {
            const name = ctor === undefined || ctor === null ? `${ctor}` : ctor.name;
            const type = new Type();
            const data = TypeData.create(name, ctor);
            if (!TypeData.tryRegister(type, data))
                return false;
            outType.value = type;
            return true;
        }
    }

    export function tryGetTypeFromReference(ref: any, outType: OutputArgument<Type>): boolean {
        return tryFind() || tryCreate();

        function tryFind() {
            const typeData = registeredData.find(d => d.isType && ctorMatches(d as TypeData)) as TypeData | undefined;
            if (!typeData)
                return false;
            const type = new Type();
            type.__id = (typeData as TypeData).id;
            outType.value = type;
            return true;

            function ctorMatches(t: TypeData) {
                const hasCtorProp = ref !== undefined && ref !== null;
                const ctor = hasCtorProp ? ref.constructor as Function : ref;
                return t.ctor === ctor;
            }
        }

        function tryCreate() {
            const hasCtorProp = ref !== undefined && ref !== null;
            const ctor = hasCtorProp ? ref.constructor : null;
            const name = hasCtorProp ? ctor.name : `${ref}`;
            const type = new Type();
            const data = TypeData.create(name, ctor);
            if (!TypeData.tryRegister(type, data))
                return false;
            outType.value = type;
            return true;
        }
    }

    export function tryGetTypeAllMembers(type: Type, outAllMembers: OutputArgument<MemberInfo[]>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!RegistryData.tryGet(type.id, outData))
            return false;
        const typeData: TypeData = outData.value! as TypeData;
        if (typeData.hasEvaluatedAllMembers) {
            outAllMembers.value = [...typeData.allMembers!];
            return true;
        }
        return tryEvaluate();

        function tryEvaluate() {
            const outMembers: OutputArgument<MemberInfo[]> = {};
            if (!__Generator.tryCreateAllTypeMembers(type, typeData.ctor, outMembers))
                return false;
            const sortedMembers = outMembers.value!.sort((a, b) => compareNames(a as MemberInfo, b as MemberInfo));
            typeData.allMembers = outAllMembers.value = sortedMembers;
            typeData.hasEvaluatedAllMembers = true;
            return true;

            function compareNames(a: MemberInfo, b: MemberInfo) {
                return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
            }
        }
    }

    export function tryGetTypeBaseType(type: Type, outBaseType: OutputArgument<Type | null>): boolean {
        const outTypeData: OutputArgument<TypeData> = {};
        if (!RegistryData.tryGet(type.id, outTypeData))
            return false;
        const typeData = outTypeData.value!;
        if (typeData.hasEvaluatedBaseType) {
            outBaseType.value = typeData.baseType;
            return true;
        }
        return tryEvaluate();

        function tryEvaluate() {
            const ctor = typeData.ctor;
            if (ctor === undefined || ctor === null) {
                outBaseType.value = null;
                return true;
            }
            const baseCtor = Object.getPrototypeOf(ctor);
            return tryGetTypeFromConstructor(baseCtor, outBaseType as OutputArgument<Type>);
        }
    }

    export function tryGetTypeName(type: Type, outName: OutputArgument<string>): boolean {
        const outData: OutputArgument<TypeData> = {};
        if (!RegistryData.tryGet(type.id, outData))
            return false;
        outName.value = outData.value!.name;
        return true;
    }

    export function tryGetMemberInfoMemberKind(member: MemberInfo, outMemberKind: OutputArgument<number>): boolean {
        const outData: OutputArgument<MemberInfoData> = {};
        if (!RegistryData.tryGet(member.id, outData))
            return false;
        outMemberKind.value = outData.value!.memberKind;
        return true;
    }

    export function tryGetMemberInfoName(member: MemberInfo, outName: OutputArgument<string>): boolean {
        const outData: OutputArgument<MemberInfoData> = {};
        if (!RegistryData.tryGet(member.id, outData))
            return false;
        outName.value = outData.value!.name;
        return true;
    }

    export function tryGetMemberInfoDeclaringType(member: MemberInfo, outDeclaringType: OutputArgument<Type | null>): boolean {
        const outData: OutputArgument<MemberInfoData> = {};
        if (!RegistryData.tryGet(member.id, outData))
            return false;
        outDeclaringType.value = outData.value!.declaringType;
        return true;
    }

    export function tryGetMemberInfoIsStatic(member: MemberInfo, outIsStatic: OutputArgument<boolean>): boolean {
        const outData: OutputArgument<MemberInfoData> = {};
        if (!RegistryData.tryGet(member.id, outData))
            return false;
        outIsStatic.value = outData.value!.isStatic;
        return true;
    }

    export function tryGetMethodInfoBaseParameters(method: MethodInfoBase, outParameters: OutputArgument<ParameterInfo[]>): boolean {
        const outData: OutputArgument<MethodInfoBaseData> = {};
        if (!RegistryData.tryGet(method.id, outData))
            return false;
        const methodData = outData.value!;
        if (methodData.hasEvaluatedParameters) {
            outParameters.value = [...methodData.parameters!];
            return true;
        }
        return tryEvaluate();

        function tryEvaluate() {
            const outNewParameters: OutputArgument<ParameterInfo[]> = {};
            if (methodData.isMethodInfo && !__Parser.tryParseMethodParameters(methodData.body.toString(), method as MethodInfo, outNewParameters))
                return false;
            if (methodData.isConstructorInfo && !__Parser.tryParseConstructorParameters(methodData.body.toString(), method as ConstructorInfo, outNewParameters))
                return false;
            const sortedParameters = outNewParameters.value!.sort((a, b) => comparePositions(a as ParameterInfo, b as ParameterInfo));
            methodData.parameters = outParameters.value = sortedParameters;
            methodData.hasEvaluatedParameters = true;
            return true;

            function comparePositions(a: ParameterInfo, b: ParameterInfo) {
                return a.position > b.position ? 1 : a.position < b.position ? -1 : 0;
            }
        }
    }

    export function tryGetMethodInfoBaseBody(method: MethodInfoBase, outBody: OutputArgument<Function>): boolean {
        const outData: OutputArgument<MethodInfoBaseData> = {};
        if (!RegistryData.tryGet(method.id, outData))
            return false;
        outBody.value = outData.value!.body;
        return true;
    }

    export function tryMethodInfoBaseInvoke(method: MethodInfoBase, target: any, parameters: any[], outResult: OutputArgument<any>): boolean {
        const outMethodData: OutputArgument<MethodInfoData> = {};
        if (!RegistryData.tryGet(method.id, outMethodData))
            return false;
        const methodData = outMethodData.value!;
        const body = methodData.body;
        if (target === null)
            return tryInvokeStatic();
        return tryInvokeInstance();

        function tryInvokeStatic() {
            const outDeclaringTypeData: OutputArgument<TypeData> = {};
            if (!RegistryData.tryGet(methodData.declaringType.id, outDeclaringTypeData))
                return false;
            const declaringTypeData = outDeclaringTypeData.value!;
            const declaringTypeCtor = declaringTypeData.ctor!;
            if (declaringTypeCtor === undefined || declaringTypeCtor === null)
                return false;
            outResult.value = body.apply(declaringTypeCtor, parameters);
            return true;
        }

        function tryInvokeInstance() {
            outResult.value = body.apply(target, parameters);
            return true;
        }
    }

    export function tryGetMethodInfoReturnType(method: MethodInfo, outReturnType: OutputArgument<TypeConstraint>): boolean {
        const outData: OutputArgument<MethodInfoData> = {};
        if (!RegistryData.tryGet(method.id, outData))
            return false;
        outReturnType.value = outData.value!.returnType;
        return true;
    }

    export function tryGetPropertyInfoGetMethod(property: PropertyInfo, outGetMethod: OutputArgument<MethodInfo | null>): boolean {
        const outData: OutputArgument<PropertyInfoData> = {};
        if (!RegistryData.tryGet(property.id, outData))
            return false;
        outGetMethod.value = outData.value!.getMethod;
        return true;
    }

    export function tryGetPropertyInfoSetMethod(property: PropertyInfo, outSetMethod: OutputArgument<MethodInfo | null>): boolean {
        const outData: OutputArgument<PropertyInfoData> = {};
        if (!RegistryData.tryGet(property.id, outData))
            return false;
        outSetMethod.value = outData.value!.setMethod;
        return true;
    }

    export function tryPropertyInfoGetValue(property: PropertyInfo, target: any, outValue: OutputArgument<any>): boolean {
        const outPropData: OutputArgument<PropertyInfoData> = {};
        if (!RegistryData.tryGet(property.id, outPropData))
            return false;
        const getMethod = outPropData.value!.getMethod;
        if (!getMethod)
            return false;
        return tryMethodInfoBaseInvoke(getMethod, target, [], outValue);
    }

    export function tryPropertyInfoSetValue(property: PropertyInfo, target: any, value: any): boolean {
        const outPropData: OutputArgument<PropertyInfoData> = {};
        if (!RegistryData.tryGet(property.id, outPropData))
            return false;
        const getMethod = outPropData.value!.getMethod;
        if (!getMethod)
            return false;
        return tryMethodInfoBaseInvoke(getMethod, target, [value], {});
    }

    export function tryGetPropertyInfoType(property: PropertyInfo, outType: OutputArgument<TypeConstraint>): boolean {
        const outData: OutputArgument<PropertyInfoData> = {};
        if (!RegistryData.tryGet(property.id, outData))
            return false;
        outType.value = outData.value!.type;
        return true;
    }

    export function tryGetParameterInfoDeclaringMethod(parameter: ParameterInfo, outDeclaringMethod: OutputArgument<MethodInfo>): boolean {
        const outData: OutputArgument<ParameterInfoData> = {};
        if (!RegistryData.tryGet(parameter.id, outData))
            return false;
        outDeclaringMethod.value = outData.value!.declaringMethod;
        return true;
    }

    export function tryGetParameterInfoPosition(parameter: ParameterInfo, outPosition: OutputArgument<number>): boolean {
        const outData: OutputArgument<ParameterInfoData> = {};
        if (!RegistryData.tryGet(parameter.id, outData))
            return false;
        outPosition.value = outData.value!.position;
        return true;
    }

    export function tryGetParameterInfoName(parameter: ParameterInfo, outName: OutputArgument<string>): boolean {
        const outData: OutputArgument<ParameterInfoData> = {};
        if (!RegistryData.tryGet(parameter.id, outData))
            return false;
        outName.value = outData.value!.name;
        return true;
    }

    export function tryGetParameterInfoParameterKind(parameter: ParameterInfo, outParameterKind: OutputArgument<number>): boolean {
        const outData: OutputArgument<ParameterInfoData> = {};
        if (!RegistryData.tryGet(parameter.id, outData))
            return false;
        outParameterKind.value = outData.value!.parameterKind;
        return true;
    }

    export function tryGetParameterInfoType(parameter: ParameterInfo, outType: OutputArgument<TypeConstraint>): boolean {
        const outData: OutputArgument<ParameterInfoData> = {};
        if (!RegistryData.tryGet(parameter.id, outData))
            return false;
        outType.value = outData.value!.type;
        return true;
    }

    export function tryGetParameterInfoIsOptional(parameter: ParameterInfo, outIsOptional: OutputArgument<boolean>): boolean {
        const outData: OutputArgument<ParameterInfoData> = {};
        if (!RegistryData.tryGet(parameter.id, outData))
            return false;
        outIsOptional.value = outData.value!.isOptional;
        return true;
    }
}