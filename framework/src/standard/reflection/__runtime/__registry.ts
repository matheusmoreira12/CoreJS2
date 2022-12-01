import { Guid } from "../../guids/index.js";
import { ConstructorInfo, MemberInfo, MemberKind, MethodInfo, MethodInfoBase, ParameterInfo, PropertyInfo, Type } from "../index.js";
import { TypeConstraint } from "../type-constraints/index.js";
import { __Generator } from "./__generator.js";
import type { OutputArgument } from "../types.js";

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

    interface TypeData extends RegistryData {
        isType: true;
        name: string;
        baseType: null;
        hasEvaluatedBaseType: boolean;
        ref: any;
        hasRef: boolean;
        ctor: Function | null;
        hasCtor: boolean;
        allMembers: MemberInfo[] | null;
        hasEvaluatedAllMembers: boolean;
    }

    interface MemberInfoData extends RegistryData {
        isMemberInfo: true;
        declaringType: Type,
        name: string;
        memberKind: number;
        isStatic: boolean;
    }

    interface MethodInfoBaseData extends MemberInfoData {
        body: Function;
        parameters: ParameterInfo[] | null;
        hasEvaluatedParameters: boolean;
    }

    interface ConstructorInfoData extends MethodInfoBaseData {
        isConstructorInfo: true;
    }

    interface MethodInfoData extends MethodInfoBaseData {
        isMethodInfo: true;
        returnType: TypeConstraint;
    }

    interface PropertyInfoData extends MemberInfoData {
        isPropertyInfo: true;
        type: TypeConstraint;
        getMethod: MethodInfo | null;
        setMethod: MethodInfo | null;
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

    const registeredData: RegistryData[] = [];

    namespace TypeData {
        export function create(name: string, ref: any, hasRef: boolean, ctor: any, hasCtor: boolean): TypeData {
            return {
                id: Guid.createUnique(),
                isType: true,
                isMemberInfo: false,
                isConstructorInfo: false,
                isMethodInfo: false,
                isPropertyInfo: false,
                isParameterInfo: false,
                baseType: null,
                hasEvaluatedBaseType: false,
                name,
                ref,
                hasRef,
                ctor,
                hasCtor,
                allMembers: null,
                hasEvaluatedAllMembers: false,
            };
        }

        export function tryRegister(type: Type, data: TypeData): boolean {
            const isAlreadyRegistered = registeredData.some(i => i.isType && classMatches(i as TypeData) || instanceMatches(i as TypeData));
            if (isAlreadyRegistered)
                return false;
            type.__id = data.id;
            registeredData.push(data);
            return true;

            function classMatches(t: TypeData) {
                return !data.hasCtor && !t.hasCtor ||
                    data.hasCtor && t.hasCtor && (t.ctor === data.ctor);
            }

            function instanceMatches(t: TypeData) {
                return !data.hasRef && !t.hasRef ||
                    data.hasRef && t.hasRef && (t.ref === data.ref);
            }
        }
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

    namespace ConstructorInfoData {
        export function create(declaringType: Type, name: string, body: Function, isStatic: boolean): ConstructorInfoData {
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
                body,
                isStatic,
                parameters: null,
                hasEvaluatedParameters: false,
            };
        }

        export function tryRegister(ref: ConstructorInfo, data: ConstructorInfoData): boolean {
            return MemberInfoData.tryRegister(ref, data);
        }
    }

    namespace MethodInfoData {
        export function create(declaringType: Type, name: string, returnType: TypeConstraint, body: Function, isStatic: boolean): MethodInfoData {
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

        export function tryRegister(prop: PropertyInfo, data: PropertyInfoData): boolean {
            return MemberInfoData.tryRegister(prop, data);
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

        export function tryRegister(param: ParameterInfo, data: ParameterInfoData): boolean {
            const isAlreadyRegistered = registeredData.some(i => i.isMemberInfo && nameMatches(i as ParameterInfoData) && declaringMethodMatches(i as ParameterInfoData));
            if (isAlreadyRegistered)
                return false;
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
            const data = registeredData.find(d => d.isType && constructorMatches(d as TypeData));
            if (!data)
                return false;
            const type = new Type();
            type.__id = (data as TypeData).id;
            outType.value = type;
            return true;

            function constructorMatches(t: TypeData) {
                return t.hasCtor && t.ctor === ctor;
            }
        }

        function tryCreate() {
            const name = ctor.name;
            const ref = ctor.prototype;
            const type = new Type();
            const data = TypeData.create(name, ref, true, ctor, true);
            if (!TypeData.tryRegister(type, data))
                return false;
            outType.value = type;
            return true;
        }
    }

    export function tryGetTypeFromReference(ref: any, outType: OutputArgument<Type>): boolean {
        return tryFind() || tryCreate();

        function tryFind() {
            const data = registeredData.find(d => d.isType && referenceMatches(d as TypeData) || constructorMatches(d as TypeData));
            if (!data)
                return false;
            const type = new Type();
            type.__id = (data as TypeData).id;
            outType.value = type;
            return true;

            function referenceMatches(t: TypeData) {
                return t.hasRef && t.ref === ref;
            }

            function constructorMatches(t: TypeData) {
                const hasCtor = ref !== undefined && ref !== null;
                const ctor = hasCtor ? ref["constructor"] as Function : null;
                return !hasCtor && !t.hasCtor || hasCtor && t.hasCtor && t.ctor === ctor;
            }
        }

        function tryCreate() {
            const hasCtor = ref !== undefined && ref !== null;
            const ctor = hasCtor ? ref.constructor : null;
            const name = hasCtor ? ctor.name : `${ref}`;
            const type = new Type();
            const data = TypeData.create(name, ref, true, ctor, hasCtor);
            if (!TypeData.tryRegister(type, data))
                return false;
            outType.value = type;
            return true;
        }
    }

    export function tryGetTypeAllMembers(type: Type, outAllMembers: OutputArgument<MemberInfo[]>): boolean {
        const outData: OutputArgument<RegistryData> = {};
        if (!tryGetRegistryData(type.id, outData))
            return false;
        const typeData: TypeData = outData.value! as TypeData;
        if (typeData.hasEvaluatedAllMembers) {
            outAllMembers.value = [...typeData.allMembers!];
            return true;
        }
        return tryEvaluate();

        function tryEvaluate() {
            const outMembers: OutputArgument<MemberInfo[]> = {};
            if (!__Generator.tryCreateAllTypeMembers(type, typeData.ctor, typeData.hasCtor, typeData.ref, typeData.hasRef, outMembers))
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
        const methodData = outData.value! as MethodInfoData;
        if (methodData.hasEvaluatedParameters) {
            outParameters.value = [...methodData.parameters!];
            return true;
        }
        return tryEvaluate();

        function tryEvaluate() {
            const outNewParameters: OutputArgument<ParameterInfo[]> = {};
            if (!__Generator.tryCreateParameters(method, methodData.body, outNewParameters))
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

    export function tryMethodInfoBaseInvoke(method: MethodInfoBase, target: any, parameters: any[], outResult: OutputArgument<any>): boolean {
        const outMethodData: OutputArgument<MethodInfoData> = {};
        if (!tryGetRegistryData(method.id, outMethodData))
            return false;
        const methodData = outMethodData.value!;
        const body = methodData.body;
        if (target === null)
            return tryInvokeStatic();
        return tryInvokeInstance();

        function tryInvokeStatic() {
            const outDeclaringTypeData: OutputArgument<TypeData> = {};
            if (!tryGetRegistryData(methodData.declaringType.id, outDeclaringTypeData))
                return false;
            const declaringTypeData = outDeclaringTypeData.value!;
            if (!declaringTypeData.hasCtor)
                return false;
            const declaringTypeCtor = declaringTypeData.ctor!;
            body.apply(declaringTypeCtor, parameters);
            return true;
        }

        function tryInvokeInstance() {
            body.apply(target, parameters);
            return true;
        }
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

    export function tryPropertyInfoGetValue(property: PropertyInfo, target: any, outValue: OutputArgument<any>): boolean {
        const outPropData: OutputArgument<PropertyInfoData> = {};
        if (!tryGetRegistryData(property.id, outPropData))
            return false;
        const getMethod = outPropData.value!.getMethod;
        if (!getMethod)
            return false;
        return tryMethodInfoBaseInvoke(getMethod, target, [], outValue);
    }

    export function tryPropertyInfoSetValue(property: PropertyInfo, target: any, value: any): boolean {
        const outPropData: OutputArgument<PropertyInfoData> = {};
        if (!tryGetRegistryData(property.id, outPropData))
            return false;
        const getMethod = outPropData.value!.getMethod;
        if (!getMethod)
            return false;
        return tryMethodInfoBaseInvoke(getMethod, target, [value], {});
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