import { assert } from "../../validation-standalone/index.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { Guid } from "../guids/index.js";
import { MethodInfo } from "./index.js";
import { TypeConstraint } from "./type-constraints/index.js";
import { OutputArgument } from "./types.js";
import { __Registry } from "./__runtime/__registry.js";

export class ParameterInfo {
    equals(other: ParameterInfo) {
        assert({ other }, [ParameterInfo]);

        return this.id === other.id;
    }

    get declaringMethod(): MethodInfo {
        const outName: OutputArgument<MethodInfo> = {};
        if (__Registry.tryGetParameterInfoDeclaringMethod(this, outName))
            return outName.value!;
        throw new InvalidOperationException(`Cannot get name.`)
    }

    get name(): string {
        const outName: OutputArgument<string> = {};
        if (__Registry.tryGetParameterInfoName(this, outName))
            return outName.value!;
        throw new InvalidOperationException(`Cannot get name.`)
    }

    get position(): number {
        const outName: OutputArgument<number> = {};
        if (__Registry.tryGetParameterInfoPosition(this, outName))
            return outName.value!;
        throw new InvalidOperationException(`Cannot get name.`)
    }

    get parameterKind(): number {
        const outName: OutputArgument<number> = {};
        if (__Registry.tryGetParameterInfoParameterKind(this, outName))
            return outName.value!;
        throw new InvalidOperationException(`Cannot get name.`)
    }

    get type(): TypeConstraint {
        const outType: OutputArgument<TypeConstraint> = {};
        if (__Registry.tryGetParameterInfoType(this, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot get type.`)
    }

    get isOptional(): boolean {
        const outType: OutputArgument<boolean> = {};
        if (__Registry.tryGetParameterInfoIsOptional(this, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot get isOptional.`)
    }

    get id(): Guid { return this.__id ?? (() => { throw new InvalidOperationException("Cannot get id. Invalid ParameterInfo instance.") })() }
    __id: Guid | null = null;
}