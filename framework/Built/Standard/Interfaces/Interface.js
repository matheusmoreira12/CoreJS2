"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enumeration_1 = require("../Enumeration");
const Types_1 = require("../Types/Types");
const Exceptions_1 = require("../Exceptions");
exports.InterfaceDifferenceKind = new Enumeration_1.Enumeration([
    "MissingProperty",
    "IncorrectType"
]);
class InterfaceDifference {
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
exports.InterfaceDifference = InterfaceDifference;
class InterfaceDifferAnalysis {
    constructor(analizedType, analizedInterface, ...differences) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__differences = differences;
    }
    get analizedType() { return this.__analizedType; }
    get analizedInterface() { return this.__analizedInterface; }
    get differences() { return this.__differences; }
}
exports.InterfaceDifferAnalysis = InterfaceDifferAnalysis;
exports.InterfaceMemberType = new Enumeration_1.Enumeration([
    "Property",
    "Function"
]);
class InterfaceMember {
    constructor(key, memberType, valueType, attributes, isOptional) {
        if (typeof key !== "string" && typeof key !== "symbol")
            throw new Exceptions_1.ArgumentTypeException(`key`, key, String);
        if (typeof memberType !== "number")
            throw new Exceptions_1.ArgumentTypeException(`memberType`, memberType, Number);
        if (valueType !== undefined && !(valueType instanceof Types_1.Type))
            throw new Exceptions_1.ArgumentTypeException(`valueType`, valueType, Types_1.Type);
        if (attributes !== undefined && typeof attributes !== "number")
            throw new Exceptions_1.ArgumentTypeException(`attributes`, attributes, Number);
        if (isOptional !== undefined && typeof isOptional !== "boolean")
            throw new Exceptions_1.ArgumentTypeException(`isOptional`, isOptional, Boolean);
        valueType = valueType === undefined ? null : valueType;
        attributes = attributes === undefined ? Types_1.MemberAttributes.Writable : attributes;
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
                case Types_1.MemberType.Property:
                    return exports.InterfaceMemberType.Property;
                case Types_1.MemberType.Function:
                    return exports.InterfaceMemberType.Property;
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
exports.InterfaceMember = InterfaceMember;
class Interface {
    constructor(...members) {
        this.__members = members;
    }
    static extract(type) {
        function* generateMembersFromType() {
            const members = type.getMembers();
            for (let member of members)
                yield InterfaceMember.__extractFromMember(member);
        }
        if (!(type instanceof Types_1.Type))
            throw new Exceptions_1.ArgumentTypeException("type", type, Types_1.Type);
        return new Interface(...generateMembersFromType());
    }
    static differ(type, _interface) {
        function* analizeMembers() {
            for (let member of type.getMembers()) {
                yield null;
            }
        }
        return new InterfaceDifferAnalysis(type, _interface, ...generateMember);
    }
    get members() { return this.__members; }
}
exports.Interface = Interface;
