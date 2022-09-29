import { InvalidOperationException } from "../exceptions/index.js";
import { MemberInfo, ParameterInfo, Type } from "./index.js";
import { OutputArgument } from "./types.js";
import { __Registry } from "./__runtime/__registry.js";

export class MethodInfoBase extends MemberInfo {
    get parameters(): ParameterInfo[] {
        const outParameters: OutputArgument<ParameterInfo[]> = {};
        if (__Registry.tryGetMethodParameters(this, outParameters))
            return outParameters.value!;
        throw new InvalidOperationException(`Cannot get memberType. Invalid ${MethodInfoBase.name} instance.`)
    }
}