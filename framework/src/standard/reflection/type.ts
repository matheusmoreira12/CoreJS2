import { assertParams } from "../../validation-standalone/index.js";
import { ArgumentTypeException, InvalidOperationException } from "../exceptions/index.js"
import { Enumeration } from "../index.js";
import { Interface } from "../interfaces/index.js";
import { MemberKind, MemberInfo, MemberSelectionOptions, ConstructorInfo, MethodInfo } from "./index.js";
import { PropertyInfo } from "./property-info.js";
import { OutputArgument, TypeMatchingConstraint } from "./types";
import { TypeConstraint, TypeConstraintKind } from "./type-constraints/index.js";
import { ArrayUtils } from "../../core-base/utils/index.js";
import { __Registry } from "./__runtime/__registry.js";

export class Type {
    static get(clas: Function): Type {
        assertParams({ clas }, [Function])

        const outType: OutputArgument<Type> = {};
        if (__Registry.tryGetTypeFromConstructor(clas, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot create type from class.`)
    }

    static of(ref: any): Type {
        const outType: OutputArgument<Type> = {};
        if (__Registry.tryGetTypeFromReference(ref, outType))
            return outType.value!;
        throw new InvalidOperationException(`Cannot create type from instance.`)
    }

    get [Symbol.toStringTag]() {
        return `Type(${this.name})`;
    }

    get allMembers(): MemberInfo[] {
        let outAllMembers: OutputArgument<MemberInfo[]> = {};
        if (!__Registry.tryGetTypeAllMembers(this, outAllMembers))
            throw new InvalidOperationException(`Cannot get allMembers.`);
        return outAllMembers.value!;
    }

    getMembers(options: number = MemberSelectionOptions.Any, name: string | null = null): MemberInfo[] {
        return [...generate.call(this)];

        function generate(this: Type) {
            if (typeof options != "number")
                throw new ArgumentTypeException("options");
            if (name !== null && typeof name != "string")
                throw new ArgumentTypeException(name);

            return ArrayUtils.where(this.allMembers, m => nameMatches(m) && staticityMatches(m) && kindMatches(m));

            function nameMatches(m: MemberInfo) { return name == null || name == m.name; }

            function staticityMatches(m: MemberInfo) {
                const isStatic = m.isStatic;
                return !(isStatic && Enumeration.contains(MemberSelectionOptions.InstanceOnly, options) ||
                    !isStatic && Enumeration.contains(MemberSelectionOptions.StaticOnly, options));
            }

            function kindMatches(m: MemberInfo) {
                return m.memberKind == MemberKind.Constructor && Enumeration.contains(MemberSelectionOptions.Constructor, options) ||
                    m.memberKind == MemberKind.Method && Enumeration.contains(MemberSelectionOptions.Methods, options) ||
                    m.memberKind == MemberKind.Property && Enumeration.contains(MemberSelectionOptions.Properties, options);
            }
        }
    }

    getMember(name: string, options: number = MemberSelectionOptions.Any): MemberInfo | null {
        return ArrayUtils.first(this.getMembers(options, name)) ?? null;
    }

    getProperty(name: string, options: number = MemberSelectionOptions.Any): PropertyInfo | null {
        const o = options// & (MemberSelectionOptions.InstanceOnly | MemberSelectionOptions.StaticOnly);
        return this.getMember(name, MemberSelectionOptions.Properties | o) as PropertyInfo | null;
    }

    getMethod(name: string, options: number = MemberSelectionOptions.Any): MethodInfo | null {
        const o = options// & (MemberSelectionOptions.InstanceOnly | MemberSelectionOptions.StaticOnly);
        return this.getMember(name, MemberSelectionOptions.Methods | o) as MethodInfo | null;
    }

    getConstructor(options: number = MemberSelectionOptions.Any, name: string): ConstructorInfo | null {
        const o = options// & (MemberSelectionOptions.InstanceOnly | MemberSelectionOptions.StaticOnly);
        return this.getMember(name, MemberSelectionOptions.Constructor | o) as ConstructorInfo | null;
    }

    obeysConstraint(constraint: TypeConstraint): boolean {
        assertParams({ other: constraint }, [TypeConstraint]);

        if (constraint.type === TypeConstraintKind.Any)
            return true;
        if (constraint.type === TypeConstraintKind.Or)
            return this.matchesAny(...constraint.baseTypes);
        if (constraint.type === TypeConstraintKind.And)
            return this.matchesAll(...constraint.baseTypes);
        return false;
    }

    equals(other: Type): boolean {
        assertParams({ other }, [Type]);

        return this.id == other.id;
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
        const outBaseType: OutputArgument<Type | null> = {};
        if (__Registry.tryGetTypeBaseType(this, outBaseType))
            return outBaseType.value!;
        throw new InvalidOperationException(`Cannot get base type.`)
    }

    get name(): string {
        const outName: OutputArgument<string> = {};
        if (__Registry.tryGetTypeName(this, outName))
            return outName.value!;
        throw new InvalidOperationException(`Cannot get name.`)
    }

    get id(): bigint { return this.__id ?? (() => { throw new InvalidOperationException("Cannot get id. Invalid Type instance.") })() }
    __id: bigint | null = null;
}