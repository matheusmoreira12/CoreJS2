import { Enumeration } from "../Enumeration";
import { Type, MemberType, MemberAttributes } from "../Types/Types";
import { ArgumentTypeException } from "../Exceptions";
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
    static __extractFromMember(member) {
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
                yield InterfaceMember.__extractFromMember(member);
        }
        if (!(type instanceof Type))
            throw new ArgumentTypeException("type");
        return new Interface(...generateMembersFromType());
    }
    get members() { return this.__members; }
}
