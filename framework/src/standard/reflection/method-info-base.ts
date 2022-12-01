import { InvalidOperationException } from "../exceptions/index.js";
import { MemberInfo, ParameterInfo } from "./index.js";
import { OutputArgument } from "./types.js";
import { __Registry } from "./__runtime/__registry.js";

export class MethodInfoBase extends MemberInfo {
    invoke(target: any, parameters: any[]): any {
        const outResult: OutputArgument<any> = {};
        if (__Registry.tryMethodInfoBaseInvoke(this, target, parameters, outResult))
            return outResult.value!;
        throw new InvalidOperationException(`Cannot invoke.`)
    }

    get parameters(): ParameterInfo[] {
        const outParameters: OutputArgument<ParameterInfo[]> = {};
        if (__Registry.tryGetMethodInfoBaseParameters(this, outParameters))
            return outParameters.value!;
        throw new InvalidOperationException(`Cannot get parameters.`)
    }

    get body(): Function {
        const outBody: OutputArgument<Function> = {};
        if (__Registry.tryGetMethodInfoBaseBody(this, outBody))
            return outBody.value!;
        throw new InvalidOperationException(`Cannot get returnType.`)
    }
}