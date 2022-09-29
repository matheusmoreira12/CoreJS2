import { assertParams } from "../../validation-standalone/index.js";
import { ArgumentTypeException, InvalidOperationException } from "../exceptions/index.js"
import { Enumeration } from "../index.js";
import { Interface } from "../interfaces/index.js";
import { MemberKind, MemberInfo, MemberSelectionOptions, ConstructorInfo, MethodInfo } from "./index.js";
import { PropertyInfo } from "./property-info.js";
import { OutputArgument, TypeMatchingConstraint } from "./types";
import { TypeConstraint, TypeConstraintKind } from "./type-constraints/index.js";
import { ArrayUtils } from "../../core-base/utils/index.js";
import { Guid } from "../guids/index.js";

export class Type {
    static get(clas: Function): Type {
        assertParams({ clas }, [Function])

        const outType: OutputArgument<Type> = {};
        if (__Registry.tryGetTypeFromClass(this, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot create type from class.`)
    }

    static of(reference: any): Type {
        const outType: OutputArgument<Type> = {};
        if (__Registry.tryGetTypeFromInstance(this, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot create type from instance.`)
    }

    get [Symbol.toStringTag]() {
        return `Type(${this.name})`;
    }

    get allMembers(): IterableIterator<MemberInfo> {
        const outType: OutputArgument<IterableIterator<MemberInfo>> = {};
        if (__Registry.tryGetAllTypeMembers(this, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot get allMembers. Invalid instance.`)
    }

    *getMembers(options: number = MemberSelectionOptions.Any, name: string | null = null): IterableIterator<MemberInfo> {
        if (typeof options != "number")
            throw new ArgumentTypeException("options");
        MemberSelectionOptions.assertFlag(options);
        if (name !== null && typeof name != "string")
            throw new ArgumentTypeException(name);

        let allMembers = this.allMembers;
        for (let member of allMembers) {
            const isStatic = member.isStatic;
            if (name !== null && name !== member.name)
                continue;
            else if (isStatic && Enumeration.contains(MemberSelectionOptions.InstanceOnly, options))
                continue;
            else if (!isStatic && Enumeration.contains(MemberSelectionOptions.StaticOnly, options))
                continue;
            else if (Enumeration.contains(MemberKind.Constructor, member.memberKind) && !Enumeration.contains(MemberSelectionOptions.Constructor, options))
                continue;
            else if (Enumeration.contains(MemberKind.Method, member.memberKind) && !Enumeration.contains(MemberSelectionOptions.Methods, options))
                continue;
            else if (Enumeration.contains(MemberKind.Property, member.memberKind) && !Enumeration.contains(MemberSelectionOptions.Properties, options))
                continue;
            else
                yield member;
        }
    }

    getMember(options: number = MemberSelectionOptions.Any, name: string): MemberInfo | null {
        return ArrayUtils.first(this.getMembers(options, name)) ?? null;
    }

    getProperty(name: string): PropertyInfo | null {
        return this.getMember(MemberSelectionOptions.Properties, name) as PropertyInfo | null;
    }

    getMethod(name: string): MethodInfo | null {
        return this.getMember(MemberSelectionOptions.Methods, name) as MethodInfo | null;
    }

    getContructor(name: string): ConstructorInfo | null {
        return this.getMember(MemberSelectionOptions.Constructor, name) as ConstructorInfo | null;
    }

    obeysConstraint(constraint: TypeConstraint): boolean {
        assertParams({ other: constraint }, [TypeConstraint]);

        if (constraint.type === TypeConstraintKind.Or)
            return this.matchesAny(...constraint.baseTypes);
        if (constraint.type === TypeConstraintKind.And)
            return this.matchesAll(...constraint.baseTypes);
        return false;
    }

    equals(other: Type): boolean {
        assertParams({ other }, [Type]);

        return this.id.equals(other.id);
    }

    extends(other: Type): boolean {
        assertParams({ other }, [Type]);

        let baseType = this.baseType;
        while (baseType !== null) {
            if (baseType.equals(other))
                return true;
            baseType = baseType.baseType;
        }
        return false;
    }

    matches(other: TypeMatchingConstraint): boolean {
        assertParams({ other }, [Interface, Type, TypeConstraint]);

        if (other instanceof Interface)
            return this.implements(other);
        if (other instanceof TypeConstraint)
            return this.obeysConstraint(other);
        return this.equals(other) || this.extends(other);
    }

    matchesAny(...others: TypeMatchingConstraint[]) {
        assertParams({ others }, [Array])

        for (let other of others) {
            if (this.matches(other))
                return true;
        }
        return false;
    }

    matchesAll(...others: TypeMatchingConstraint[]) {
        assertParams({ others }, [Array])

        for (let other of others) {
            if (!this.matches(other))
                return false;
        }
        return true;
    }

    implements(_interface: Interface) {
        assertParams({ _interface }, [Interface])

        let analysis = Interface.differ(this, _interface);
        if (analysis.isEmpty)
            return true;

        return false;
    }

    get baseType(): Type | null {
        if (this._hasCtor) {
            if (this._hasReference) {
                const baseReference = Object.getPrototypeOf(this._reference);
                if (baseReference === null)
                    return null;
                else
                    return Type.of(baseReference);
            }
            else {
                const baseCtor = Object.getPrototypeOf(this._ctor);
                if (typeof baseCtor !== "function")
                    return null;
                else
                    return Type.get(baseCtor);
            }
        }
        else
            return null;
    }

    get name() { return this._name; }

    get id() { return this.__id ?? (() => { throw new InvalidOperationException("Cannot get id. Invalid instance.") })() }
    __id: Guid | null = null;
}