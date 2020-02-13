﻿import { Type } from "../Types/Type";
import { InterfaceMember } from "./InterfaceMember";
import { MemberInfo, MemberType, MemberSelectionType, MemberAttributes } from "../Types/index";
import { InterfaceMemberType, InterfaceDifferenceKind } from "./Interfaces";
import { InterfaceImplementationAnalysis, InterfaceDifference } from "./Analysis/index";
import { Enumeration } from "../index";

export class Interface {
    static extract(type: Function): Interface;
    static extract(type: Type): Interface;
    static extract(type: any): Interface;
    static extract(type: any): Interface {
        function* generateInterfaceMembers(type: Type): Generator<InterfaceMember> {
            function generateInterfaceMember(member: MemberInfo): InterfaceMember | null {
                function getMemberType(): number {
                    if (Enumeration.contains(MemberType.Function, member.memberType))
                        return InterfaceMemberType.Function;
                    else if (Enumeration.contains(MemberType.Property, member.memberType))
                        return InterfaceMemberType.Property;
                    else if (Enumeration.contains(MemberType.Field, member.memberType))
                        return InterfaceMemberType.Field;
                    return -1;
                }

                const memberType = getMemberType();
                return new InterfaceMember(member.key, memberType, member.type, member.attributes);
            }

            const instanceMembers: Iterable<MemberInfo> = type.getMembers(MemberSelectionType.Instance | MemberSelectionType.Property | MemberSelectionType.Function);
            for (let member of instanceMembers) {
                const interfaceMember = generateInterfaceMember(member);
                if (interfaceMember === null)
                    continue;

                yield interfaceMember;
            }
        }

        if (type instanceof Function)
            type = Type.get(type);
        else if (!(type instanceof Type))
            type = Type.of(type);

        return new Interface(...generateInterfaceMembers(type));
    }

    static differ(type: Type, _interface: Interface): InterfaceImplementationAnalysis {
        function* analizeMembers(): Generator<InterfaceDifference> {
            function memberAttributesMatch(interfaceMemberAttributes: number, typeMemberAttributes: number): boolean {
                const memberIsEnumerable = Enumeration.contains(MemberAttributes.Enumerable, interfaceMemberAttributes),
                    memberIsConfigurable = Enumeration.contains(MemberAttributes.Configurable, interfaceMemberAttributes),
                    memberIsWritable = Enumeration.contains(MemberAttributes.Writable, interfaceMemberAttributes);

                const typeMemberIsEnumerable = Enumeration.contains(MemberAttributes.Enumerable, typeMemberAttributes),
                    typeMemberIsConfigurable = Enumeration.contains(MemberAttributes.Configurable, typeMemberAttributes),
                    typeMemberIsWritable = Enumeration.contains(MemberAttributes.Writable, typeMemberAttributes);

                if (memberIsEnumerable && !typeMemberIsEnumerable)
                    return false;
                if (memberIsConfigurable && !typeMemberIsConfigurable)
                    return false;
                if (memberIsWritable && !typeMemberIsWritable)
                    return false;

                return true;
            }

            function memberTypeMatches(interfaceMemberType: number, typeMemberType: number): boolean {
                let typeMemberIsFunction: boolean = Enumeration.contains(MemberType.Function, typeMemberType),
                    typeMemberIsProperty: boolean = Enumeration.contains(MemberType.Property, typeMemberType);

                if (interfaceMemberType == InterfaceMemberType.Property && !typeMemberIsProperty)
                    return false;
                if (interfaceMemberType == InterfaceMemberType.Function && !typeMemberIsFunction)
                    return false;

                return true;
            }

            function memberValueTypeMatches(interfaceMemberValueType: Type | Interface | null, typeMemberValueType: Type): boolean {
                if (interfaceMemberValueType === null)
                    return true;
                if (interfaceMemberValueType instanceof Type && interfaceMemberValueType.equals(typeMemberValueType))
                    return true;
                if (interfaceMemberValueType instanceof Interface && typeMemberValueType.implements(interfaceMemberValueType))
                    return true;

                return false;
            }

            function getMemberDifferenceType(interfaceMember: InterfaceMember, typeMember: MemberInfo | undefined): number {
                if (typeMember === undefined) {
                    if (!interfaceMember.isOptional)
                        return InterfaceDifferenceKind.Missing;
                }
                else {
                    if (!memberAttributesMatch(interfaceMember.attributes, typeMember.attributes))
                        return InterfaceDifferenceKind.MissingAttributes;
                    else if (!memberTypeMatches(interfaceMember.memberType, typeMember.memberType))
                        return InterfaceDifferenceKind.Invalid;
                    else if (!memberValueTypeMatches(interfaceMember.type, typeMember.type))
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