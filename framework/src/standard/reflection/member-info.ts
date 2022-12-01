import { assert } from "../../validation-standalone/index.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { Guid } from "../guids/index.js";
import { Type } from "./index.js";
import { OutputArgument } from "./types.js";
import { __Registry } from "./__runtime/__registry.js";

export class MemberInfo {
    equals(other: MemberInfo) {
        assert({ other }, [MemberInfo]);

        return this.id === other.id;
    }

    get memberKind(): number {
        const outMemberKind: OutputArgument<number> = {};
        if (__Registry.tryGetMemberInfoMemberKind(this, outMemberKind))
            return outMemberKind.value!;
        throw new InvalidOperationException(`Cannot get memberType. Invalid instance.`)
    }
    
    get name(): string {
        const outName: OutputArgument<string> = {};
        if (__Registry.tryGetMemberInfoName(this, outName))
            return outName.value!;
        throw new InvalidOperationException(`Cannot get name. Invalid instance.`)
    }

    get declaringType(): Type | null {
        const outDeclaringType: OutputArgument<Type | null> = {};
        if (__Registry.tryGetMemberInfoDeclaringType(this, outDeclaringType))
            return outDeclaringType.value!;
        throw new InvalidOperationException(`Cannot get declaringType. Invalid instance.`)
    }

    get isStatic(): boolean {
        const outIsStatic: OutputArgument<boolean> = {};
        if (__Registry.tryGetMemberInfoIsStatic(this, outIsStatic))
            return outIsStatic.value!;
        throw new InvalidOperationException(`Cannot get isStatic. Invalid instance.`)
    }

    get id() { return this.__id ?? (() => { throw new InvalidOperationException("Cannot get id. Invalid instance.") })() }
    __id: Guid | null = null;
}