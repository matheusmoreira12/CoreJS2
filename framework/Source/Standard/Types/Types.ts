import { Enumeration } from "../Enumeration";
import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "../Exceptions";
import { ObjectUtils } from "../ObjectUtils";
import { Dictionary } from "../Collections";

export const InterfaceDifferenceKind = new Enumeration([
    "MissingProperty",
    "IncorrectType"
]);

export class InterfaceDifference {
    constructor(analizedType: Type, analizedInterface: Interface, propertyName: string, differenceType: number) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__propertyName = propertyName;
        this.__differenceType = differenceType;
    }

    get analizedType(): Type { return this.__analizedType; }
    private __analizedType: Type;

    get analizedInterface(): Interface { return this.__analizedInterface; }
    private __analizedInterface: Interface;

    get propertyName(): string | symbol { return this.__propertyName; }
    private __propertyName: string;

    get differenceType(): number { return this.__differenceType; }
    private __differenceType: number;
}

export class InterfaceDifferAnalysis {
    constructor(analizedType: Type, analizedInterface: Interface, ...differences: InterfaceDifference[]) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__differences = differences;
    }

    get analizedType() { return this.__analizedType; }
    private __analizedType: Type;

    get analizedInterface() { return this.__analizedInterface; }
    private __analizedInterface: Interface;

    get differences() { return this.__differences; }
    private __differences: InterfaceDifference[];
}

export const InterfaceMemberType = new Enumeration([
    "Property",
    "Function"
]);

export class InterfaceMember {
    static __createFromMember(member: Member): InterfaceMember {
        function convertMemberType(memberType: number): number {
            switch (memberType) {
                case MemberType.Property:
                    return InterfaceMemberType.Property;
                case MemberType.Function:
                    return InterfaceMemberType.Property;
            }
            return null;
        }

        let memberType = convertMemberType(member.memberType);
        if (memberType === null)
            return null;

        return new InterfaceMember(member.key, memberType, member.type, member.attributes, true);
    }

    constructor(key: string | symbol, memberType: number, valueType?: Type, attributes?: number, isOptional?) {
        if (typeof key !== "string" && typeof key !== "symbol")
            throw new ArgumentTypeException(`key`, Type.of(key));
        if (typeof memberType !== "number")
            throw new ArgumentTypeException(`memberType`, Type.of(memberType));
        if (valueType !== undefined && !(valueType instanceof Type))
            throw new ArgumentTypeException(`valueType`, Type.of(valueType));
        if (attributes !== undefined && typeof attributes !== "number")
            throw new ArgumentTypeException(`attributes`, Type.of(attributes));
        if (isOptional !== undefined && typeof isOptional !== "boolean")
            throw new ArgumentTypeException(`isOptional`, Type.of(isOptional));

        valueType = valueType === undefined ? null : valueType;
        attributes = attributes === undefined ? MemberAttributes.Writable : attributes;
        isOptional = isOptional === undefined ? false : isOptional;

        this.__key = key;
        this.__memberType = memberType;
        this.__valueType = valueType;
        this.__attributes = attributes;
        this.__isOptional = isOptional;
    }

    get key() { return this.__key; }
    private __key: string | symbol;

    get memberType(): number { return this.__memberType; }
    private __memberType: number;

    get valueType(): Type { return this.__valueType; }
    private __valueType: Type;

    get attributes(): number { return this.__attributes; }
    private __attributes: number;

    get isOptional(): boolean { return this.__isOptional; }
    private __isOptional: boolean;
}

export class Interface {
    static extract(type: Type) {
        function* generateMembersFromType(): Generator<InterfaceMember> {
            const nonStaticMembers: Generator<Member> = type.getMembers(MemberSelectionType.Any & ~MemberSelectionType.Static);
            for (let member of nonStaticMembers)
                yield InterfaceMember.__createFromMember(member);
        }

        if (!(type instanceof Type))
            throw new ArgumentTypeException("type");

        return new Interface(...generateMembersFromType());
    }

    constructor(...members: InterfaceMember[]) {
        this.__members = members;
    }

    get members(): InterfaceMember[] { return this.__members; }
    private __members: InterfaceMember[];
}

export const MemberSelectionAttributes = new Enumeration({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4,
    Any: 7
});

export const MemberSelectionType = new Enumeration({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16,
    Any: 31,
});

export class Type {
    private static __createTypeFromClass(_class) {
        let result = new Type();
        result.__initializeWithClass(_class);

        return result;
    }

    private static __createTypeFromInstance(instance) {
        let result = new Type();
        result.__initializeWithInstance(instance);

        return result;
    }

    static get(_class) {
        if (!(_class instanceof Function))
            throw new ArgumentTypeException("_class");

        return this.__createTypeFromClass(_class);
    }

    static of(instance) {
        return this.__createTypeFromInstance(instance);
    }

    constructor() {
    }

    private __initializeWithInstance(instance) {
        this.__instance = instance;

        let instanceHasConstructor = ObjectUtils.hasPrototype(instance);
        if (instanceHasConstructor)
            this.__initializeWithClass(instance.constructor);
        this.__hasInstance = true;
    }

    private __initializeWithClass(_class) {
        this.__class = _class;
        this.__hasClass = true;
    }

    getName() {
        if (!this.__hasClass)
            return String(this.__instance);

        return this.__class.name;
    }

    * getOwnMembers(selectionType?: number, selectionAttributes?: number) {
        function* generateMembers(this: Type) {
            if (!this.__hasClass) return;

            for (let key of ObjectUtils.getOwnPropertyKeys(this.__class)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__class, key);
                yield Member.__createFromPropertyDescriptor(this, key, descriptor, true);
            }

            if (!this.__hasInstance) return;

            for (let key of ObjectUtils.getOwnPropertyKeys(this.__instance)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__instance, key);
                yield Member.__createFromPropertyDescriptor(this, key, descriptor, false);
            }
        }

        function* selectMembers(this: Type, members: Iterable<Member>) {
            function memberTypeMatches(memberType) {
                if (!MemberSelectionType.contains(MemberSelectionType.Function, selectionType) && MemberType.contains(MemberType.Function, memberType)) return false;
                if (!MemberSelectionType.contains(MemberSelectionType.Property, selectionType) && MemberType.contains(MemberType.Property, memberType)) return false;
                if (!MemberSelectionType.contains(MemberSelectionType.Static, selectionType) && MemberType.contains(MemberType.Static, memberType)) return false;
                if (!MemberSelectionType.contains(MemberSelectionType.Instance, selectionType) && MemberType.contains(MemberType.Instance, memberType)) return false;

                return true;
            }

            function memberAttributesMatch(memberAttributes) {
                return MemberSelectionAttributes.contains(memberAttributes, selectionAttributes);
            }

            for (let member of members) {
                if (!memberTypeMatches(member.memberType)) continue;
                if (!memberAttributesMatch(member.attributes)) continue;

                yield member;
            }
        }

        if (selectionType !== undefined && typeof selectionType !== "number")
            throw new InvalidTypeException("selectionType", typeof selectionType);
        if (selectionAttributes !== undefined && typeof selectionAttributes !== "number")
            throw new InvalidTypeException("selectionAttributes", typeof selectionAttributes);

        selectionType = selectionType || MemberSelectionType.Any;
        selectionAttributes = selectionAttributes || MemberSelectionAttributes.Any;

        let members = generateMembers.call(this);
        let selectedMembers = selectMembers.call(this, members);

        yield* selectedMembers;
    }

    * getMembers(selectionType?, selectionAttributes?) {
        yield* this.getOwnMembers(selectionType, selectionAttributes);

        for (let parentType of this.getParentTypes())
            yield* parentType.getOwnMembers(selectionType, selectionAttributes);
    }

    private __getEffectiveValue() {
        if (!this.__hasClass)
            return this.__instance;

        return this.__class;
    }

    equals(other) {
        if (!(other instanceof Type))
            throw new ArgumentTypeException("other");

        return this.__getEffectiveValue() === other.__getEffectiveValue();
    }

    extends(other) {
        for (let type of this.getParentTypes()) {
            if (type.equals(other))
                return true;
        }

        return false;
    }

    equalsOrExtends(other) {
        return this.equals(other) || this.extends(other);
    }

    implements(_interface) {
        function getMemberByKey(members, key) {
            return members.find(m => m.key === key);
        }

        function attributesMatch(memberAttributes, interfaceMemberAttributes) {
            return MemberAttributes.contains(interfaceMemberAttributes, memberAttributes);
        }

        function membersMatch(member, interfaceMember) {
            if (!member) {
                if (interfaceMember.isOptional)
                    return true;

                return false;
            }

            if (interfaceMember.type instanceof Type) {
                if (!member.type.equalsOrExtends(interfaceMember.type))
                    return false;
            }
            else if (interfaceMember.type instanceof Interface) {
                if (!member.type.implements(interfaceMember.type))
                    return false;
            }

            if (!attributesMatch(member.attributes, interfaceMember.attributes))
                return false;

            return true;
        }

        if (!Type.of(_interface).equalsOrExtends(Type.get(Interface)))
            throw new ArgumentTypeException("interface", Type.of(_interface), Type.get(Interface));

        let members = [...this.getMembers(MemberSelectionType.Property | MemberSelectionType.Function)];

        for (let interfaceMember of _interface.members) {
            let member = getMemberByKey(members, interfaceMember.key);

            if (!membersMatch(member, interfaceMember))
                return false;
        }

        return true;
    }

    * getParentTypes() {
        let parentType = this.getParentType();
        if (parentType === null)
            return;

        yield parentType;
        yield* parentType.getParentTypes();
    }

    private __getParentInstance(instance) {
        let parentInstance = Object.getPrototypeOf(instance);
        return parentInstance;
    }

    private __getParentClass(_class) {
        let parentClass = Object.getPrototypeOf(_class);
        if (parentClass instanceof Function)
            return parentClass;

        return null;
    }

    getParentType() {
        if (this.__hasClass) {
            if (this.__hasInstance) {
                let parentInstance = this.__getParentInstance(this.__instance);
                if (parentInstance !== null)
                    return Type.of(parentInstance);
            }
            else {
                let parentClass = this.__getParentClass(this.__class);
                if (parentClass !== null)
                    return Type.get(parentClass);
            }
        }

        return null;
    }

    __instance: any = null;
    __hasInstance: boolean = false;
    __class: Function = null;
    __hasClass: boolean = false;
    __typeofResult: string = null;
}

export const MemberAttributes = new Enumeration({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4
});

export const MemberType = new Enumeration({
    Property: 1,
    Function: 2,
    Field: 4,
    Static: 8
});

export class Member {
    static __createFromPropertyDescriptor(parentType: Type, key: string | symbol, descriptor: PropertyDescriptor, isStatic: boolean = false) {
        function getAttributesFromDescriptor(descriptor) {
            return (descriptor.writable ? MemberAttributes.Writable : 0) |
                (descriptor.enumerable ? MemberAttributes.Enumerable : 0) |
                (descriptor.configurable ? MemberAttributes.Configurable : 0);
        }

        const attributes = getAttributesFromDescriptor(descriptor);
        const type = Type.of(descriptor.value);

        const isFunction = type.equals(Type.get(Function));
        const memberType = (isFunction ? MemberType.Function : MemberType.Property) | (isStatic ? MemberType.Static : 0);

        return new Member(key, type, parentType, memberType, attributes);
    }

    constructor(key: string | symbol, type: Type, parentType: Type, memberType: number, attributes: number) {
        if (this.constructor === Member)
            throw new InvalidOperationException("Invalid constructor");

        this.__key = key;
        this.__type = type;
        this.__parentType = parentType;
        this.__memberType = memberType;
        this.__attributes = attributes;
    }

    isSame(other: Member) {
        if (this.__key !== other.__key) return false;
        if (this.__memberType !== other.memberType) return false;
        if (this.__memberType === MemberType.Property && this.__type.equals(other.__type)) return false;

        return true;
    }

    get parentType(): Type { return this.__parentType; }
    protected __parentType: Type;

    get type(): Type { return this.__type; }
    protected __type: Type;

    get memberType(): number { return this.__memberType; }
    protected __memberType: number;

    get key(): string | symbol { return this.__key; }
    protected __key: string | symbol;

    get attributes(): number { return this.__attributes; }
    protected __attributes: number;
}