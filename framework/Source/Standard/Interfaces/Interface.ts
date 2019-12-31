import { Enumeration } from "../Enumeration.js";
import { Type, MemberType, MemberAttributes, Member, MemberSelectionType } from "../Types/Types.js";
import { ArgumentTypeException } from "../Exceptions.js";

export const InterfaceDifferenceKind = new Enumeration([
    "Missing",
    "Invalid",
    "MissingAttributes",
    "IncorrectType"
]);

export class InterfaceDifference {
    constructor(analizedType: Type, analizedInterface: Interface, propertyKey: string | symbol, differenceType: number) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__propertyKey = propertyKey;
        this.__differenceType = differenceType;
    }

    get analizedType(): Type { return this.__analizedType; }
    private __analizedType: Type;

    get analizedInterface(): Interface { return this.__analizedInterface; }
    private __analizedInterface: Interface;

    get propertyKey(): string | symbol { return this.__propertyKey; }
    private __propertyKey: string | symbol;

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
    constructor(key: string | symbol, memberType: number, type?: Type | Interface, attributes?: number, isOptional?) {
        if (typeof key !== "string" && typeof key !== "symbol")
            throw new ArgumentTypeException(`key`, key, String);
        if (typeof memberType !== "number")
            throw new ArgumentTypeException(`memberType`, memberType, Number);
        if (type !== undefined && !(type instanceof Type))
            throw new ArgumentTypeException(`valueType`, type, Type);
        if (attributes !== undefined && typeof attributes !== "number")
            throw new ArgumentTypeException(`attributes`, attributes, Number);
        if (isOptional !== undefined && typeof isOptional !== "boolean")
            throw new ArgumentTypeException(`isOptional`, isOptional, Boolean);

        this.__key = key;
        this.__memberType = memberType;
        this.__type = type === undefined ? null : type;
        this.__attributes = attributes === undefined ? MemberAttributes.Enumerable : attributes;
        this.__isOptional = isOptional === undefined ? false : isOptional;
    }

    get key() { return this.__key; }
    private __key: string | symbol;

    get memberType(): number { return this.__memberType; }
    private __memberType: number;

    get type(): Type | Interface | null { return this.__type; }
    private __type: Type | Interface | null;

    get attributes(): number { return this.__attributes; }
    private __attributes: number;

    get isOptional(): boolean { return this.__isOptional; }
    private __isOptional: boolean;
}

export class Interface {
    static extract(type: Type) {
        function* generateInterfaceMembers(): Generator<InterfaceMember> {
            function generateInterfaceMember(member: Member): InterfaceMember | undefined {
                let memberIsFunction: boolean = MemberType.contains(MemberType.Function, member.memberType),
                    memberIsProperty: boolean = MemberType.contains(MemberType.Property, member.memberType);
                if (memberIsFunction)
                    return new InterfaceMember(member.key, InterfaceMemberType.Function, member.type, member.attributes);
                else if (memberIsProperty)
                    return new InterfaceMember(member.key, InterfaceMemberType.Property, member.type, member.attributes);

                return undefined;
            }

            const instanceMembers: Generator<Member> = type.getMembers(MemberSelectionType.Instance | MemberSelectionType.Property | MemberSelectionType.Function);
            for (let member of instanceMembers)
                yield <InterfaceMember>generateInterfaceMember(member);
        }

        if (!(type instanceof Type))
            throw new ArgumentTypeException("type", type, Type);

        return new Interface(...generateInterfaceMembers());
    }

    static differ(type: Type, _interface: Interface): InterfaceDifferAnalysis {
        function* analizeMembers(): boolean {
            function memberAttributesMatch(interfaceMemberAttributes: number, typeMemberAttributes: number) {
                const memberIsEnumerable = MemberAttributes.contains(MemberAttributes.Enumerable, interfaceMemberAttributes),
                    memberIsConfigurable = MemberAttributes.contains(MemberAttributes.Configurable, interfaceMemberAttributes),
                    memberIsWritable = MemberAttributes.contains(MemberAttributes.Writable, interfaceMemberAttributes);

                const typeMemberIsEnumerable = MemberAttributes.contains(MemberAttributes.Enumerable, typeMemberAttributes),
                    typeMemberIsConfigurable = MemberAttributes.contains(MemberAttributes.Configurable, typeMemberAttributes),
                    typeMemberIsWritable = MemberAttributes.contains(MemberAttributes.Writable, typeMemberAttributes);

                return !(memberIsEnumerable && !typeMemberIsEnumerable || memberIsConfigurable && !typeMemberIsConfigurable || memberIsWritable && !typeMemberIsWritable);
            }

            function memberTypeMatches(interfaceMemberType: number, typeMemberType: number): boolean {
                const memberIsProperty = InterfaceMemberType.contains(interfaceMemberType, InterfaceMemberType.Property),
                    memberIsFunction = InterfaceMemberType.contains(interfaceMemberType, InterfaceMemberType.Function);

                const typeMemberIsProperty = InterfaceMemberType.contains(typeMemberType, InterfaceMemberType.Property),
                    typeMemberIsFunction = InterfaceMemberType.contains(typeMemberType, InterfaceMemberType.Function);

                return !(memberIsProperty && !typeMemberIsProperty || memberIsFunction && !typeMemberIsFunction);
            }

            function memberValueTypeMatches(interfaceMemberValueType: Type | Interface | null, typeMemberValueType: Type): boolean {
                return interfaceMemberValueType === null || (interfaceMemberValueType instanceof Type && interfaceMemberValueType.equals(typeMemberValueType)) || (interfaceMemberValueType instanceof Interface && typeMemberValueType.implements(interfaceMemberValueType))
            }

            function getMemberDifferenceType(interfaceMember: InterfaceMember, typeMember: Member | undefined) {
                if (typeMember === undefined)
                    return InterfaceDifferenceKind.Missing;
                else {
                    if (!memberAttributesMatch(interfaceMember.attributes, typeMember.attributes))
                        return InterfaceDifferenceKind.MissingAttributes;
                    else if (!memberTypeMatches(interfaceMember.memberType, typeMember.memberType))
                        return InterfaceDifferenceKind.Invalid;
                    else if (!memberValueTypeMatches(interfaceMember.type, typeMember.type))
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

    constructor(...members: InterfaceMember[]) {
        this.__members = members;
    }

    get members(): InterfaceMember[] { return this.__members; }
    private __members: InterfaceMember[];
}