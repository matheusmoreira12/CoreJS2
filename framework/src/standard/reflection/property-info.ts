import { InvalidOperationException } from "../exceptions/index.js";
import { MemberInfo, MethodInfo } from "./index.js";
import { OutputArgument } from "./types.js";
import { __Registry } from "./__runtime/__index.js";

export class PropertyInfo extends MemberInfo {
    get getMethod(): MethodInfo {
        const outGetMethod: OutputArgument<MethodInfo> = {};
        if (__Registry.tryGetGetMethod(this, outGetMethod))
            return outGetMethod.value!;
        throw new InvalidOperationException(`Cannot get declaring type. Invalid ${PropertyInfo.name} instance.`)
    }

    get setMethod(): MethodInfo {
        const outGetMethod: OutputArgument<MethodInfo> = {};
        if (__Registry.tryGetGetMethod(this, outGetMethod))
            return outGetMethod.value!;
        throw new InvalidOperationException(`Cannot get declaring type. Invalid ${PropertyInfo.name} instance.`)
    }
}