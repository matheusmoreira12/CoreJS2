import { ArgumentTypeException, InvalidOperationException } from "../exceptions/index.js"
import { Interface } from "../interfaces/index.js";
import { ClassOf } from "./types.js";
import { MemberType, MemberInfo, MemberSelectionOptions, ConstructorInfo, FunctionInfo } from "./index.js";
import { Enumeration } from "../index.js";
import { FieldInfo } from "./field-info.js";
import { PropertyInfo } from "./property-info.js";
import { FieldInfoBase } from "./field-info-base.js";
import { TypeConstraint, TypeConstraintType } from "./type-constraints/type-constraint.js";
import { assertParams } from "../../validation-standalone/index.js";

export type TypeMatchingConstraint = Type | Interface | TypeConstraint;

export class Type {
    static get(ctor: Function): Type {
        assertParams({ ctor }, [Function])

        const name = ctor.name;
        const result = new Type(name);
        result._ctor = ctor;
        result._hasCtor = true;
        result._reference = null;
        result._hasReference = false;
        return result;
    }

    static of(reference: any): Type {
        let name: string = "";
        let ctor: NewableFunction | null = null;
        let hasCtor: boolean = false;
        if (reference === undefined || reference === null)
            name = String(reference);
        else {
            hasCtor = typeof reference.constructor === "function";
            if (hasCtor) {
                ctor = reference.constructor;
                name = ctor!.name;
            }
        }
        const result = new Type(name);
        result._ctor = ctor;
        result._hasCtor = hasCtor;
        result._reference = reference;
        result._hasReference = true;
        return result;
    }

    constructor(name: string) {
        this._ctor = null;
        this._hasCtor = false;
        this._name = name;
        this._reference = null;
        this._hasReference = false;
        this._members = [];
        this._membersEvaluated = false;
    }

    get [Symbol.toStringTag]() {
        return `Type(${this.name})`;
    }

    getMembers(options: number = MemberSelectionOptions.Any, name: string | null = null): MemberInfo[] {
        const createMembers = (declaringType: Type): MemberInfo[] => {
            const createMember = (name: string, descriptor: PropertyDescriptor, declaringType: Type, isStatic: boolean = false): MemberInfo => {
                const isField = descriptor.hasOwnProperty("value");
                const isProperty = descriptor.hasOwnProperty("get") || descriptor.hasOwnProperty("set");
                const isFunction = descriptor.value instanceof Function;
                const isConstructor = isFunction && name == "constructor";
                if (isField) {
                    if (isFunction) {
                        if (isConstructor && !isStatic)
                            return new ConstructorInfo(name, declaringType, []);
                        else
                            return new FunctionInfo(name, declaringType, [], isStatic);
                    }
                    else {
                        const type = Type.of(descriptor.value);
                        return new FieldInfo(name, declaringType, type, isStatic);
                    }
                }
                else if (isProperty)
                    return new PropertyInfo(name, declaringType);
                else
                    throw new InvalidOperationException("Cannot create member.");
            }

            let staticDescriptors: PropertyDescriptorMap = {};
            let instanceDescriptors: PropertyDescriptorMap = {};
            let _type: Type | null = declaringType;
            while (_type !== null) {
                if (_type._hasCtor) {
                    staticDescriptors = { ...Object.getOwnPropertyDescriptors(_type._ctor), ...staticDescriptors };
                    if (_type._hasReference)
                        instanceDescriptors = { ...Object.getOwnPropertyDescriptors(_type._reference), ...instanceDescriptors };
                    else {
                        const prototype = _type._ctor!.prototype;
                        if (prototype !== undefined && prototype !== null)
                            instanceDescriptors = { ...Object.getOwnPropertyDescriptors(_type._ctor!.prototype), ...instanceDescriptors };
                    }
                }
                _type = _type.baseType;
            }

            const members: MemberInfo[] = [];
            for (let name in staticDescriptors) {
                const descriptor = staticDescriptors[name];
                const member = createMember(name, descriptor, declaringType, true);
                members.push(member);
            }
            for (let name in instanceDescriptors) {
                const descriptor = instanceDescriptors[name];
                const member = createMember(name, descriptor, declaringType);
                members.push(member);
            }
            return members;
        }

        const selectMembers = (members: MemberInfo[], options: number, name: string | null): MemberInfo[] => {
            const selectedMembers: MemberInfo[] = [];
            for (let member of members) {
                const isStatic = (<FieldInfoBase>member).isStatic;
                if (name !== null && name !== member.name)
                    continue;
                else if (isStatic && Enumeration.contains(MemberSelectionOptions.InstanceOnly, options))
                    continue;
                else if (!isStatic && Enumeration.contains(MemberSelectionOptions.StaticOnly, options))
                    continue;
                else if (Enumeration.contains(MemberType.Constructor, member.memberType) && !Enumeration.contains(MemberSelectionOptions.Constructor, options))
                    continue;
                else if (Enumeration.contains(MemberType.Function, member.memberType) && !Enumeration.contains(MemberSelectionOptions.Functions, options))
                    continue;
                else if (Enumeration.contains(MemberType.Property, member.memberType) && !Enumeration.contains(MemberSelectionOptions.Properties, options))
                    continue;
                else if (Enumeration.contains(MemberType.Field, member.memberType) && !Enumeration.contains(MemberSelectionOptions.Fields, options))
                    continue;
                else
                    selectedMembers.push(member);
            }
            return selectedMembers;
        }

        if (typeof options != "number")
            throw new ArgumentTypeException("options");
        MemberSelectionOptions.assertFlag(options);
        if (name !== null && typeof name != "string")
            throw new ArgumentTypeException(name);

        let members: MemberInfo[];
        if (this._membersEvaluated)
            members = this._members;
        else {
            members = createMembers(this);
            this._members = members;
            this._membersEvaluated = true;
        }
        if (options == MemberSelectionOptions.Any && name === null)
            return members;
        else {
            const selectedMembers = selectMembers(members, options, name);
            return selectedMembers;
        }
    }

    obeysConstraint(constraint: TypeConstraint): boolean {
        assertParams({ other: constraint }, [TypeConstraint]);

        if (constraint.type === TypeConstraintType.Or)
            return this.matchesAny(...constraint.baseTypes);
        if (constraint.type === TypeConstraintType.And)
            return this.matchesAll(...constraint.baseTypes);
        return false;
    }

    equals(other: Type): boolean {
        assertParams({ other }, [Type]);

        if (this._hasCtor) {
            if (other._hasCtor)
                return this._ctor === other._ctor;
        }
        if (this._hasReference) {
            if (other._hasReference)
                return this._reference === other._reference;
        }
        return false;
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
        console.log(analysis);
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

    protected _ctor: NewableFunction | null;
    protected _hasCtor: boolean;
    protected _name: string;
    protected _reference: any;
    protected _hasReference: boolean;
    protected _members: MemberInfo[];
    protected _membersEvaluated: boolean;
}

const ERR_INVALID_TYPE = "Invalid Type instance.";