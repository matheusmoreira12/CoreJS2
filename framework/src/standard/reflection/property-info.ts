import { assert } from "../../validation-standalone/index.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { MemberInfo, MethodInfo } from "./index.js";
import { TypeConstraint } from "./type-constraints/index.js";
import { OutputArgument } from "./types.js";
import { __Registry } from "./__runtime/__registry.js";

export class PropertyInfo extends MemberInfo {
    get getMethod(): MethodInfo | null {
        const outGetMethod: OutputArgument<MethodInfo> = {};
        if (__Registry.tryGetPropertyInfoGetMethod(this, outGetMethod))
            return outGetMethod.value!;
        throw new InvalidOperationException(`Cannot get getMethod.`);
    }

    get setMethod(): MethodInfo | null {
        const outGetMethod: OutputArgument<MethodInfo> = {};
        if (__Registry.tryGetPropertyInfoSetMethod(this, outGetMethod))
            return outGetMethod.value!;
        throw new InvalidOperationException(`Cannot get setMethod.`);
    }

    getValue(target: any): any {
        const outGetValue: OutputArgument<MethodInfo> = {};
        if (__Registry.tryPropertyInfoGetValue(this, target, outGetValue))
            return outGetValue.value!;
        throw new InvalidOperationException(`Cannot get value.`);
    }

    setValue(target: any, value: any) {
        if (__Registry.tryPropertyInfoSetValue(this, target, value))
            return;
        throw new InvalidOperationException(`Cannot set value.`);
    }

    get type(): TypeConstraint {
        const outType: OutputArgument<TypeConstraint> = {};
        if (__Registry.tryGetPropertyInfoType(this, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot get type.`);
    }
}