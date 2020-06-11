import { ArgumentTypeException, InvalidOperationException } from "../Exceptions/index.js"
import { Interface } from "../Interfaces/index.js";
import { Class } from "./Types.js";
import { MemberType, MemberInfo, MemberSelectionOptions, ConstructorInfo, FunctionInfo } from "./index.js";
import { Enumeration } from "../index.js";
import { FieldInfo } from "./FieldInfo.js";
import { PropertyInfo } from "./PropertyInfo.js";
import { FieldInfoBase } from "./FieldInfoBase.js";

export class Type extends MemberInfo {
    static get(ctor: Class<any>): Type {
        if (typeof ctor != "function")
            throw new ArgumentTypeException("ctor", Function);

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
        let ctor: Class<any> = null;
        let hasCtor: boolean = false;
        if (reference === undefined)
            name = "undefined";
        else if (reference === null)
            name = "null";
        else {
            hasCtor = typeof reference.constructor === "function";
            if (hasCtor) {
                ctor = reference.constructor;
                name = ctor.name;
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
        super(MemberType.Type, name);

        this._ctor = null;
        this._hasCtor = false;
        this._reference = null;
        this._hasReference = false;
        this._members = [];
        this._membersEvaluated = false;
    }

    get [Symbol.toStringTag]() {
        return `Type(${this.name})`;
    }

    getMembers(options: number = MemberSelectionOptions.Any, name: string | null = null): MemberInfo[] {
        function createMembers(declaringType: Type): MemberInfo[] {
            function createMember(name: string, descriptor: PropertyDescriptor, declaringType: Type, isStatic: boolean = false): MemberInfo {
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
                        const prototype = _type._ctor.prototype;
                        if (prototype !== undefined && prototype !== null)
                            instanceDescriptors = { ...Object.getOwnPropertyDescriptors(_type._ctor.prototype), ...instanceDescriptors };
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

        function selectMembers(members: MemberInfo[], options: number, name: string | null) {
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

    equals(other: Type): boolean {
        if (other instanceof Type) {
            if (this._hasReference) {
                if (other._hasReference)
                    return this._reference === other._reference;
                else if (other._hasCtor)
                    return this._reference.constructor === other._ctor;
            }
            else if (this._hasCtor) {
                if (other._hasCtor)
                    return this._ctor === other._ctor;
                else if (other._hasReference)
                    return this._ctor === other._reference.constructor;
            }
            throw new InvalidOperationException(ERR_INVALID_TYPE);
        }
        else
            throw new ArgumentTypeException("other");
    }

    extends(other: Type): boolean {
        let baseType = this.baseType;
        while (baseType !== null) {
            if (baseType.equals(other))
                return true;
            baseType = baseType.baseType;
        }
        return false;
    }

    matches(other: Type | Interface): boolean {
        if (other instanceof Interface)
            return this.implements(other);
        else
            return this.equals(other) || this.extends(other);
    }

    matchesAny(...others: (Type | Interface)[]) {
        for (let other of others) {
            if (this.matches(other))
                return true;
        }
        return false;
    }

    matchesAll(...others: (Type | Interface)[]) {
        for (let other of others) {
            if (!this.matches(other))
                return false;
        }
        return true;
    }

    implements(_interface: Interface) {
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

    protected _ctor: Class<any>;
    protected _hasCtor: boolean;
    protected _reference: any;
    protected _hasReference: boolean;
    protected _members: MemberInfo[];
    protected _membersEvaluated: boolean;
}

const ERR_INVALID_TYPE = "Invalid Type instance.";