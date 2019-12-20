import { Enumeration } from "../Enumeration";
import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "../Exceptions";
import { ObjectUtils } from "../ObjectUtils";
export const InterfaceDifferenceKind = new Enumeration([
    "MissingProperty",
    "IncorrectType"
]);
export class InterfaceDifference {
    constructor(analizedType, analizedInterface, propertyName, differenceType) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__propertyName = propertyName;
        this.__differenceType = differenceType;
    }
    get analizedType() { return this.__analizedType; }
    get analizedInterface() { return this.__analizedInterface; }
    get propertyName() { return this.__propertyName; }
    get differenceType() { return this.__differenceType; }
}
export class InterfaceDifferAnalysis {
    constructor(analizedType, analizedInterface, ...differences) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__differences = differences;
    }
    get analizedType() { return this.__analizedType; }
    get analizedInterface() { return this.__analizedInterface; }
    get differences() { return this.__differences; }
}
export const InterfaceMemberType = new Enumeration([
    "Property",
    "Function"
]);
export class InterfaceMember {
    constructor(key, memberType, valueType, attributes, isOptional) {
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
    static __createFromMember(member) {
        function convertMemberType(memberType) {
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
    get key() { return this.__key; }
    get memberType() { return this.__memberType; }
    get valueType() { return this.__valueType; }
    get attributes() { return this.__attributes; }
    get isOptional() { return this.__isOptional; }
}
export class Interface {
    constructor(...members) {
        this.__members = members;
    }
    static extract(type) {
        function* generateMembersFromType() {
            const members = type.getMembers();
            for (let member of members)
                yield InterfaceMember.__createFromMember(member);
        }
        if (!(type instanceof Type))
            throw new ArgumentTypeException("type");
        return new Interface(...generateMembersFromType());
    }
    get members() { return this.__members; }
}
export const MemberSelectionAttributes = new Enumeration({
    Any: 0,
    Configurable: 1,
    Enumerable: 2,
    Writable: 4,
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
    constructor() {
        this.__instance = null;
        this.__hasInstance = false;
        this.__class = null;
        this.__hasClass = false;
        this.__typeofResult = null;
    }
    static __createTypeFromClass(_class) {
        let result = new Type();
        result.__initializeWithClass(_class);
        return result;
    }
    static __createTypeFromInstance(instance) {
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
    __initializeWithInstance(instance) {
        this.__instance = instance;
        let instanceHasConstructor = ObjectUtils.hasPrototype(instance);
        if (instanceHasConstructor)
            this.__initializeWithClass(instance.constructor);
        this.__hasInstance = true;
    }
    __initializeWithClass(_class) {
        this.__class = _class;
        this.__hasClass = true;
    }
    getName() {
        if (!this.__hasClass)
            return String(this.__instance);
        return this.__class.name;
    }
    *getOwnMembers(selectionType, selectionAttributes) {
        function* generateMembers() {
            if (!this.__hasClass)
                return;
            for (let key of ObjectUtils.getOwnPropertyKeys(this.__class)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__class, key);
                yield Member.__createFromPropertyDescriptor(this, key, descriptor, true);
            }
            if (!this.__hasInstance)
                return;
            for (let key of ObjectUtils.getOwnPropertyKeys(this.__instance)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__instance, key);
                yield Member.__createFromPropertyDescriptor(this, key, descriptor, false);
            }
        }
        function* selectMembers(members) {
            function memberTypeMatches(memberType) {
                if (!MemberSelectionType.contains(MemberSelectionType.Function, selectionType) && MemberType.contains(MemberType.Function, memberType))
                    return false;
                if (!MemberSelectionType.contains(MemberSelectionType.Property, selectionType) && MemberType.contains(MemberType.Property, memberType))
                    return false;
                if (!MemberSelectionType.contains(MemberSelectionType.Field, selectionType) && MemberType.contains(MemberType.Field, memberType))
                    return false;
                if (!MemberSelectionType.contains(MemberSelectionType.Static, selectionType) && MemberType.contains(MemberType.Static, memberType))
                    return false;
                if (!MemberSelectionType.contains(MemberSelectionType.Instance, selectionType) && MemberType.contains(MemberType.Instance, memberType))
                    return false;
                return true;
            }
            function memberAttributesMatch(memberAttributes) {
                if (MemberSelectionAttributes.contains(MemberSelectionAttributes.Enumerable, selectionAttributes) && !MemberAttributes.contains(MemberAttributes.Enumerable, memberAttributes))
                    return false;
                if (MemberSelectionAttributes.contains(MemberSelectionAttributes.Configurable, selectionAttributes) && !MemberAttributes.contains(MemberAttributes.Configurable, memberAttributes))
                    return false;
                if (MemberSelectionAttributes.contains(MemberSelectionAttributes.Writable, selectionAttributes) && !MemberAttributes.contains(MemberAttributes.Writable, memberAttributes))
                    return false;
                return true;
            }
            for (let member of members) {
                if (!memberTypeMatches(member.memberType))
                    continue;
                if (!memberAttributesMatch(member.attributes))
                    continue;
                yield member;
            }
        }
        if (selectionType !== undefined && typeof selectionType !== "number")
            throw new InvalidTypeException("selectionType", typeof selectionType);
        if (selectionAttributes !== undefined && typeof selectionAttributes !== "number")
            throw new InvalidTypeException("selectionAttributes", typeof selectionAttributes);
        selectionType = selectionType === undefined ? MemberSelectionType.Any : selectionType;
        selectionAttributes = selectionAttributes === undefined ? MemberSelectionAttributes.Any : selectionAttributes;
        let members = generateMembers.call(this);
        if (selectionType === MemberSelectionType.Any && selectionAttributes === MemberSelectionAttributes.Any)
            yield* members;
        else {
            let selectedMembers = selectMembers.call(this, members);
            yield* selectedMembers;
        }
    }
    *getMembers(selectionType, selectionAttributes) {
        yield* this.getOwnMembers(selectionType, selectionAttributes);
        for (let parentType of this.getParentTypes())
            yield* parentType.getOwnMembers(selectionType, selectionAttributes);
    }
    __getEffectiveValue() {
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
    *getParentTypes() {
        let parentType = this.getParentType();
        if (parentType === null)
            return;
        yield parentType;
        yield* parentType.getParentTypes();
    }
    __getParentInstance(instance) {
        let parentInstance = Object.getPrototypeOf(instance);
        return parentInstance;
    }
    __getParentClass(_class) {
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
    constructor(key, type, parentType, memberType, attributes) {
        if (this.constructor === Member)
            throw new InvalidOperationException("Invalid constructor");
        this.__key = key;
        this.__type = type;
        this.__parentType = parentType;
        this.__memberType = memberType;
        this.__attributes = attributes;
    }
    static __createFromPropertyDescriptor(parentType, key, descriptor, isStatic = false) {
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
    isSame(other) {
        if (this.__key !== other.__key)
            return false;
        if (this.__memberType !== other.memberType)
            return false;
        if (this.__memberType === MemberType.Property && this.__type.equals(other.__type))
            return false;
        return true;
    }
    get parentType() { return this.__parentType; }
    get type() { return this.__type; }
    get memberType() { return this.__memberType; }
    get key() { return this.__key; }
    get attributes() { return this.__attributes; }
}
