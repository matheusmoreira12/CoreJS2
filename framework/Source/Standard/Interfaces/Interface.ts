import { Enumeration } from "../Enumeration";
import { Type, MemberType, MemberAttributes, Member, MemberSelectionType } from "../Types/Types";
import { ArgumentTypeException } from "../Exceptions";

export const InterfaceDifferenceKind = new Enumeration([
    "Missing",
    "Invalid",
    "MissingAttributes",
    "WrongType"
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
    constructor(key: string | symbol, memberType: number, valueType?: Type, attributes?: number, isOptional?) {
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
        function* generateInterfaceMembers(): Generator<InterfaceMember> {
            function generateInterfaceMember(member: Member): InterfaceMember {
                let memberIsFunction: boolean = MemberType.contains(MemberType.Function, member.memberType),
                    memberIsProperty: boolean = MemberType.contains(MemberType.Property, member.memberType);
                if (memberIsFunction)
                    return new InterfaceMember(member.key, InterfaceMemberType.Function, member.type, member.attributes);
                else if (memberIsProperty)
                    return new InterfaceMember(member.key, InterfaceMemberType.Property, member.type, member.attributes);
            }

            const instanceMembers: Generator<Member> = type.getMembers(MemberSelectionType.Instance | MemberSelectionType.Property | MemberSelectionType.Function);
            for (let member of instanceMembers)
                yield generateInterfaceMember(member);
        }

        if (!(type instanceof Type))
            throw new ArgumentTypeException("type", type, Type);

        return new Interface(...generateInterfaceMembers());
    }

    static differ(type: Type, _interface: Interface): InterfaceDifferAnalysis {
        function* analizeMembers() {
            function memberAttributesMatch(interfaceMember, typeMember) {
                let interfaceMemberIsEnumerable = MemberAttributes.contains(MemberAttributes.Enumerable, interfaceMember),
                    interfaceMemberIsConfigurable = MemberAttributes.contains(MemberAttributes.Configurable, interfaceMember),
                    interfaceMemberIsWritable = MemberAttributes.contains(MemberAttributes.Writable, interfaceMember);

                let typeMemberIsEnumerable = MemberAttributes.contains(MemberAttributes.Enumerable, typeMember),
                    typeMemberIsConfigurable = MemberAttributes.contains(MemberAttributes.Configurable, typeMember),
                    typeMemberIsWritable = MemberAttributes.contains(MemberAttributes.Writable, typeMember);

                if (interfaceMemberIsEnumerable && !typeMemberIsEnumerable ||
                    interfaceMemberIsConfigurable && !typeMemberIsConfigurable ||
                    interfaceMemberIsWritable && !typeMemberIsWritable)
                    return false;

                return true;
            }

            let typeMembers = [...type.getMembers(MemberSelectionType.Instance | MemberSelectionType.Property | MemberSelectionType.Function)];
            for (let member of _interface.members) {
                let typeMember = typeMembers.find(m => m.key == member.key);
                if (typeMember === undefined)
                    yield new InterfaceDifference(type, _interface, member.key, InterfaceDifferenceKind.Missing);
                else {
                    if (memberAttributesMatch(member.attributes, typeMember.attributes))
                }

                yield null;
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