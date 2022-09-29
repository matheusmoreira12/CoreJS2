import { Guid } from "../../guids/index.js";
import { StringReader } from "../../strings/string-reader.js";
import { ConstructorInfo, MemberInfo, MethodInfo, ParameterInfo, PropertyInfo, Type } from "../index.js";
import { OutputArgument } from "../types.js";
import { __Registry } from "./__registry.js";

export namespace __Generator {
    export function tryCreateConstructor(target: any, declaringType: Type, outConstructor: OutputArgument<ConstructorInfo>): boolean {
        const constructor = new ConstructorInfo();
        const outId: OutputArgument<Guid> = {};
        if (!__Registry.tryRegisterConstructor(constructor, target, declaringType, outId))
            return false;
        constructor.__id = outId.value!;
        outConstructor.value = constructor;
        return true;
    }

    export function tryCreateMethod(target: any, declaringType: Type, name: string, body: Function, isStatic: boolean, outMethod: OutputArgument<ConstructorInfo>): boolean {
        const method = new MethodInfo();
        const outId: OutputArgument<Guid> = {};
        if (!__Registry.tryRegisterMethod(method, target, declaringType, name, body, isStatic, outId.value!))
            return false;
        method.__id = outId.value!;
        const outParameters: OutputArgument<ParameterInfo[]> = {};
        if (!tryParseMethodParameters(method, body.toString(), outParameters))
            return false;
        outMethod.value = method;
        return true;
    }

    function tryParseMethodParameters(method: MethodInfo, bodyStr: string, outParameters: OutputArgument<ParameterInfo[]>): boolean {
        return tryParseArrow(bodyStr, outParameters) ||
            tryParseAnonymous(bodyStr, outParameters) ||
            tryParseNamed(bodyStr, outParameters) ||
            tryParseAsyncNamed(bodyStr, outParameters) ||
            tryParseGeneratorNamed(bodyStr, outParameters) ||
            tryParseAsyncGeneratorNamed(bodyStr, outParameters);

        function tryParseArrow(bodyStr: string, outParameters: OutputArgument<ParameterInfo[]>) {
            const reader = new StringReader(bodyStr);
            skipBlankSpace(reader);
            if (!tryReadString(reader, "("))
                return false;
            if (!tryReadParameters(reader, outParameters))
                return false;
            if (!tryReadString(reader, ")"))
                return false;
            skipBlankSpace(reader);
            if (!tryReadString(reader, "=>"))
                return false;
        }

        function tryParseAnonymous(bodyStr: string, outParameters: OutputArgument<ParameterInfo[]>) {
            const reader = new StringReader(bodyStr);
            if (!tryReadString(reader, "function"))
                return false;
            skipBlankSpace(reader);
            if (!tryReadString(reader, "("))
                return false;
            if (!tryReadParameters(reader, outParameters))
                return false;
            if (!tryReadString(reader, ")"))
                return false;
            skipBlankSpace(reader);
            if (!tryReadString(reader, "{"))
                return false;
        }

        function tryParseNamed(bodyStr: string, outParameters: OutputArgument<ParameterInfo[]>) {
            const reader = new StringReader(bodyStr);
            if (!tryReadString(reader, "function"))
                return false;
            skipBlankSpace(reader);
            if (!tryReadString(reader, "function"))
                return false;
            skipBlankSpace(reader);
            if (!tryReadString(reader, "("))
                return false;
            if (!tryReadParameters(reader, outParameters))
                return false;
            if (!tryReadString(reader, ")"))
                return false;
            skipBlankSpace(reader);
            if (!tryReadString(reader, "{"))
                return false;
        }

        function tryReadString(reader: StringReader, str: string): boolean {
            const rcs = new Array(str.length);
            const l = str.length;
            return reader.readBlock(rcs, 0, l) == l && rcs.join("") == str;
        }

        function tryReadIdentifier(reader: StringReader, outIdentifier: OutputArgument<string>): boolean {
            
        }

        function skipBlankSpace(reader: StringReader) {
            while (/\s/.test(reader.peek() ?? ""))
                reader.skip();
        }
    }

    export function tryCreatePropertyForField(target: any, declaringType: Type, name: string, isStatic: boolean, outProperty: OutputArgument<PropertyInfo>): boolean {
        const getter = fieldGetterFactory(name);
        const setter = fieldSetterFactory(name);
        return tryCreateProperty(target, declaringType, name, getter, setter, isStatic, outProperty);
    }

    export function tryCreateProperty(target: any, declaringType: Type, name: string, getter: (() => any) | undefined, setter: ((value: any) => void) | undefined, outProperty: OutputArgument<PropertyInfo>): boolean {
        let getterMethod = null;
        if (getter)
            tryCreateMethod(target, declaringType, `__get_${name}`, getter, isStatic);
        let setterMethod = null;
        if (setter)
            tryCreateMethod(target, declaringType, `__set_${name}`, setter, isStatic);
        const p = new PropertyInfo();
        __Registry.registerProperty(p, target, declaringType, getterMethod, setterMethod, isStatic);
        return p;
    }

    function fieldGetterFactory(name: string): () => any {
        return new Function(`return function __get_${name}() { return this["${name}"]; };`) as () => any;
    }

    function fieldSetterFactory(name: string): (value: any) => void {
        return new Function(`return function __set_${name}() { return this["${name}"]; };`) as (value: any) => void;
    }
}
