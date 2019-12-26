"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enumeration_1 = require("../Enumeration");
const Types_1 = require("../Types/Types");
const Exceptions_1 = require("../Exceptions");
exports.InterfaceDifferenceKind = new Enumeration_1.Enumeration([
    "Missing",
    "Invalid",
    "MissingAttributes",
    "WrongType"
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
        attributes = attributes === undefined ? Types_1.MemberAttributes.Enumerable : attributes;
        isOptional = isOptional === undefined ? false : isOptional;
        this.__key = key;
        this.__memberType = memberType;
        this.__valueType = valueType;
        this.__attributes = attributes;
        this.__isOptional = isOptional;
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
        function* generateInterfaceMembers() {
            function generateInterfaceMember(member) {
                let memberIsFunction = Types_1.MemberType.contains(Types_1.MemberType.Function, member.memberType), memberIsProperty = Types_1.MemberType.contains(Types_1.MemberType.Property, member.memberType);
                if (memberIsFunction)
                    return new InterfaceMember(member.key, exports.InterfaceMemberType.Function, member.type, member.attributes);
                else if (memberIsProperty)
                    return new InterfaceMember(member.key, exports.InterfaceMemberType.Property, member.type, member.attributes);
            }
            const instanceMembers = type.getMembers(Types_1.MemberSelectionType.Instance | Types_1.MemberSelectionType.Property | Types_1.MemberSelectionType.Function);
            for (let member of instanceMembers)
                yield generateInterfaceMember(member);
        }
        if (!(type instanceof Types_1.Type))
            throw new Exceptions_1.ArgumentTypeException("type", type, Types_1.Type);
        return new Interface(...generateInterfaceMembers());
    }
    static differ(type, _interface) {
        function* analizeMembers() {
            function memberAttributesMatch(interfaceMember, typeMember) {
                let interfaceMemberIsEnumerable = Types_1.MemberAttributes.contains(Types_1.MemberAttributes.Enumerable, interfaceMember), interfaceMemberIsConfigurable = Types_1.MemberAttributes.contains(Types_1.MemberAttributes.Configurable, interfaceMember), interfaceMemberIsWritable = Types_1.MemberAttributes.contains(Types_1.MemberAttributes.Writable, interfaceMember);
                let typeMemberIsEnumerable = Types_1.MemberAttributes.contains(Types_1.MemberAttributes.Enumerable, typeMember), typeMemberIsConfigurable = Types_1.MemberAttributes.contains(Types_1.MemberAttributes.Configurable, typeMember), typeMemberIsWritable = Types_1.MemberAttributes.contains(Types_1.MemberAttributes.Writable, typeMember);
                if (interfaceMemberIsEnumerable && !typeMemberIsEnumerable ||
                    interfaceMemberIsConfigurable && !typeMemberIsConfigurable ||
                    interfaceMemberIsWritable && !typeMemberIsWritable)
                    return false;
                return true;
            }
            let typeMembers = [...type.getMembers(Types_1.MemberSelectionType.Instance | Types_1.MemberSelectionType.Property | Types_1.MemberSelectionType.Function)];
            for (let member of _interface.members) {
                let typeMember = typeMembers.find(m => m.key == member.key);
                if (typeMember === undefined)
                    yield new InterfaceDifference(type, _interface, member.key, exports.InterfaceDifferenceKind.Missing);
                else {
                    if (memberAttributesMatch(member.attributes, typeMember.attributes))
                        ;
                }
                yield null;
            }
        }
        return new InterfaceDifferAnalysis(type, _interface, ...analizeMembers());
    }
    get members() { return this.__members; }
}
exports.Interface = Interface;
