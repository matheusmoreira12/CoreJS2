import { InvalidOperationException } from "../exceptions/index.js";
import { MethodInfoBase } from "./index.js";
import { TypeConstraint } from "./type-constraints/index.js";
import { OutputArgument } from "./types.js";
import { __Registry } from "./__runtime/__registry.js";

export class MethodInfo extends MethodInfoBase {
    get returnType(): TypeConstraint {
        const outReturnType: OutputArgument<TypeConstraint> = {};
        if (__Registry.tryGetMethodInfoReturnType(this, outReturnType))
            return outReturnType.value!;
        throw new InvalidOperationException(`Cannot get returnType. Invalid instance.`)
    }
}