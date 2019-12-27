import { Enumeration } from "../Enumeration";
import { Type, MemberType, MemberAttributes, MemberSelectionType } from "../Types/Types";
import { ArgumentTypeException } from "../Exceptions";
export const InterfaceDifferenceKind = new Enumeration([
    "Missing",
    "Invalid",
    "MissingAttributes",
    "IncorrectType"
]);
export class InterfaceDifference {
    constructor(analizedType, analizedInterface, propertyKey, differenceType) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__propertyKey = propertyKey;
        this.__differenceType = differenceType;
    }
    get analizedType() { return this.__analizedType; }
    get analizedInterface() { return this.__analizedInterface; }
    get propertyKey() { return this.__propertyKey; }
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
            throw new ArgumentTypeException(`key`, key, String);
        if (typeof memberType !== "number")
            throw new ArgumentTypeException(`memberType`, memberType, Number);
        if (valueType !== undefined && !(valueType instanceof Type))
            throw new ArgumentTypeException(`valueType`, valueType, Type);
        if (attributes !== undefined && typeof attributes !== "number")
            throw new ArgumentTypeException(`attributes`, attributes, Number);
        if (isOptional !== undefined && typeof isOptional !== "boolean")
            throw new ArgumentTypeException(`isOptional`, isOptional, Boolean);
        valueType = valueType === undefined ? null : valueType;
        attributes = attributes === undefined ? MemberAttributes.Enumerable : attributes;
        isOptional = isOptional === undefined ? false : isOptional;
        this.__key = key;
        this.__memberType = memberType;
        this.__type = valueType;
        this.__attributes = attributes;
        this.__isOptional = isOptional;
    }
    get key() { return this.__key; }
    get memberType() { return this.__memberType; }
    get type() { return this.__type; }
    get attributes() { return this.__attributes; }
    get isOptional() { return this.__isOptional; }
}
export class Interface {
    constructor(...members) {
        this.__members = members;
    }
    static extract(type) {
        function* generateInterfaceMembers() {
            function generateInterfaceMember(member) {
                let memberIsFunction = MemberType.contains(MemberType.Function, member.memberType), memberIsProperty = MemberType.contains(MemberType.Property, member.memberType);
                if (memberIsFunction)
                    return new InterfaceMember(member.key, InterfaceMemberType.Function, member.type, member.attributes);
                else if (memberIsProperty)
                    return new InterfaceMember(member.key, InterfaceMemberType.Property, member.type, member.attributes);
            }
            const instanceMembers = type.getMembers(MemberSelectionType.Instance | MemberSelectionType.Property | MemberSelectionType.Function);
            for (let member of instanceMembers)
                yield generateInterfaceMember(member);
        }
        if (!(type instanceof Type))
            throw new ArgumentTypeException("type", type, Type);
        return new Interface(...generateInterfaceMembers());
    }
    static differ(type, _interface) {
        function* analizeMembers() {
            function memberAttributesMatch(interfaceMemberAttributes, typeMemberAttributes) {
                const memberIsEnumerable = MemberAttributes.contains(MemberAttributes.Enumerable, interfaceMemberAttributes), memberIsConfigurable = MemberAttributes.contains(MemberAttributes.Configurable, interfaceMemberAttributes), memberIsWritable = MemberAttributes.contains(MemberAttributes.Writable, interfaceMemberAttributes);
                const typeMemberIsEnumerable = MemberAttributes.contains(MemberAttributes.Enumerable, typeMemberAttributes), typeMemberIsConfigurable = MemberAttributes.contains(MemberAttributes.Configurable, typeMemberAttributes), typeMemberIsWritable = MemberAttributes.contains(MemberAttributes.Writable, typeMemberAttributes);
                return !(memberIsEnumerable && !typeMemberIsEnumerable || memberIsConfigurable && !typeMemberIsConfigurable || memberIsWritable && !typeMemberIsWritable);
            }
            function memberTypeMatches(interfaceMemberType, typeMemberType) {
                const memberIsProperty = InterfaceMemberType.contains(interfaceMemberType, InterfaceMemberType.Property), memberIsFunction = InterfaceMemberType.contains(interfaceMemberType, InterfaceMemberType.Function);
                const typeMemberIsProperty = InterfaceMemberType.contains(typeMemberType, InterfaceMemberType.Property), typeMemberIsFunction = InterfaceMemberType.contains(typeMemberType, InterfaceMemberType.Function);
                return !(memberIsProperty && !typeMemberIsProperty || memberIsFunction && !typeMemberIsFunction);
            }
            function getMemberDifferenceType(member, typeMember) {
                if (typeMember === undefined)
                    return InterfaceDifferenceKind.Missing;
                else {
                    if (!memberAttributesMatch(member.attributes, typeMember.attributes))
                        return InterfaceDifferenceKind.MissingAttributes;
                    else if (!memberTypeMatches(member.memberType, typeMember.memberType))
                        return InterfaceDifferenceKind.Invalid;
                    else if (member.type.equals(typeMember.memberType))
                        return InterfaceDifferenceKind.IncorrectType;
                }
                return null;
            }
            let typeMembers = [...type.getMembers(MemberSelectionType.Instance)];
            for (let interfaceMember of _interface.members) {
                let typeMember = typeMembers.find(m => m.key == interfaceMember.key);
                let differenceType = getMemberDifferenceType(interfaceMember, typeMember);
                if (differenceType === null)
                    continue;
                yield new InterfaceDifference(type, _interface, interfaceMember.key, differenceType);
            }
        }
        return new InterfaceDifferAnalysis(type, _interface, ...analizeMembers());
    }
    get members() { return this.__members; }
}
