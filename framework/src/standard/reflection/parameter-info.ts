import { InvalidOperationException } from "../exceptions/index.js";
import { MemberInfo, Type } from "./index.js";
import { OutputArgument } from "./types.js";
import { __Registry } from "./__runtime/__registry.js";

export class ParameterInfo extends MemberInfo {
    get type(): Type {        
        const outType: OutputArgument<Type> = {};
        if (__Registry.tryGetParameterType(this, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot get type. Invalid instance.`)
    }

    get isOptional(): boolean {        
        const outType: OutputArgument<boolean> = {};
        if (__Registry.tryGetParameterIsOptional(this, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot get isOptional. Invalid instance.`)
    }
}