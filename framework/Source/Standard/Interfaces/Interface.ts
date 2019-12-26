import { Enumeration } from "../Enumeration";
import { Type, MemberType, MemberAttributes, Member } from "../Types/Types";
import { ArgumentTypeException } from "../Exceptions";

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
    static __extractFromMember(member: Member): InterfaceMember {
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
            const members: Generator<Member> = type.getMembers();
            for (let member of members)
                yield InterfaceMember.__extractFromMember(member);
        }

        if (!(type instanceof Type))
            throw new ArgumentTypeException("type", type, Type);

        return new Interface(...generateMembersFromType());
    }

    static differ(type: Type, _interface: Interface): InterfaceDifferAnalysis {


        function* analizeMembers() {
            for (let member of type.getMembers()) {
                yield null;
            }
        }

        return new InterfaceDifferAnalysis(type, _interface, ...generateMember);
    }

    constructor(...members: InterfaceMember[]) {
        this.__members = members;
    }

    get members(): InterfaceMember[] { return this.__members; }
    private __members: InterfaceMember[];
}