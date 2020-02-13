import { Type } from "../Types/Type";
import { InterfaceMember } from "./InterfaceMember";
import { MemberInfo, MemberType, MemberSelectionType, MemberAttributes } from "../Types/index";
import { InterfaceMemberType, InterfaceDifferenceKind } from "./Interfaces";
import { InterfaceImplementationAnalysis, InterfaceDifference } from "./Analysis/index";
import { Enumeration } from "../index";

function convertMemberTypeToInterfaceMemberType(memberType: number) {
    if (Enumeration.contains(MemberType.Function, memberType))
        return InterfaceMemberType.Function;
    else if (Enumeration.contains(MemberType.Property, memberType))
        return InterfaceMemberType.Property;
    else if (Enumeration.contains(MemberType.Field, memberType))
        return InterfaceMemberType.Field;
    else
        return -1;
}

function compareMemberAttributesWithInterfaceMemberAttributes(typeMemberAttributes: number, interfaceMemberAttributes: number) {
    const interfaceMemberIsEnumerable = Enumeration.contains(MemberAttributes.Enumerable, interfaceMemberAttributes),
        interfaceMemberIsConfigurable = Enumeration.contains(MemberAttributes.Configurable, interfaceMemberAttributes),
        interfaceMemberIsWritable = Enumeration.contains(MemberAttributes.Writable, interfaceMemberAttributes);

    const memberIsEnumerable = Enumeration.contains(MemberAttributes.Enumerable, typeMemberAttributes),
        memberIsConfigurable = Enumeration.contains(MemberAttributes.Configurable, typeMemberAttributes),
        memberIsWritable = Enumeration.contains(MemberAttributes.Writable, typeMemberAttributes);

    return !(interfaceMemberIsEnumerable && !memberIsEnumerable || interfaceMemberIsConfigurable && !memberIsConfigurable || interfaceMemberIsWritable && !memberIsWritable);
}

function compareMemberTypeWithInterfaceType(memberType: number, interfaceMemberType: number) {
    const equivalentInterfaceMemberType = convertMemberTypeToInterfaceMemberType(memberType);
    return equivalentInterfaceMemberType == interfaceMemberType;
}

function compareMemberValueTypeWithInterfaceValueType(memberValueType: Type, interfaceMemberValueType: Type | Interface | null) {
    if (interfaceMemberValueType === null)
        return true;
    else if (interfaceMemberValueType instanceof Type)
        return interfaceMemberValueType.equals(memberValueType);
    else if (interfaceMemberValueType instanceof Interface)
        return memberValueType.implements(interfaceMemberValueType);
    else
        return false;
}

export class Interface {
    static extract(type: Function): Interface;
    static extract(type: Type): Interface;
    static extract(type: any): Interface;
    static extract(type: any): Interface {
        function* generateInterfaceMembers(type: Type): Generator<InterfaceMember> {
            function generateInterfaceMember(member: MemberInfo): InterfaceMember {
                const interfaceMemberType = convertMemberTypeToInterfaceMemberType(member.memberType);
                return new InterfaceMember(member.key, interfaceMemberType, member.type, member.attributes);
            }

            const instanceMembers: Iterable<MemberInfo> = type.getMembers(MemberSelectionType.Instance | MemberSelectionType.Property | MemberSelectionType.Function);
            for (let member of instanceMembers)
                yield generateInterfaceMember(member);
        }

        if (type instanceof Function)
            type = Type.get(type);
        else if (!(type instanceof Type))
            type = Type.of(type);

        return new Interface(...generateInterfaceMembers(type));
    }

    static differ(type: Type, _interface: Interface): InterfaceImplementationAnalysis {
        function* analizeMembers(): Generator<InterfaceDifference> {
            function getMemberDifferenceType(interfaceMember: InterfaceMember, typeMember: MemberInfo | undefined): number {
                if (typeMember === undefined) {
                    if (!interfaceMember.isOptional)
                        return InterfaceDifferenceKind.Missing;
                }
                else {
                    if (!compareMemberAttributesWithInterfaceMemberAttributes(typeMember.attributes, interfaceMember.attributes))
                        return InterfaceDifferenceKind.MissingAttributes;
                    else if (!compareMemberTypeWithInterfaceType(typeMember.memberType, interfaceMember.memberType))
                        return InterfaceDifferenceKind.Invalid;
                    else if (!compareMemberValueTypeWithInterfaceValueType(typeMember.type, interfaceMember.type))
                        return InterfaceDifferenceKind.IncorrectType;
                }
                return InterfaceDifferenceKind.None;
            }

            let typeMembers = [...type.getMembers(MemberSelectionType.Instance)];
            for (let interfaceMember of _interface.members) {
                let typeMember = typeMembers.find(m => m.key === interfaceMember.key);

                let differenceType = getMemberDifferenceType(interfaceMember, typeMember);
                if (differenceType == InterfaceDifferenceKind.None)
                    continue;

                yield new InterfaceDifference(type, _interface, interfaceMember.key, differenceType);
            }
        }

        return new InterfaceImplementationAnalysis(type, _interface, ...analizeMembers());
    }

    constructor(...members: InterfaceMember[]) {
        this.__members = members;
    }

    get members(): InterfaceMember[] { return this.__members; }
    private __members: InterfaceMember[];

    get isEmpty(): boolean { return this.members.length == 0; }
}