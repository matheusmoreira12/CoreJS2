﻿import { FieldInfo, MemberInfo, MemberSelectionOptions, MemberKind, Type } from "../reflection/index.js";
import { InterfaceDifference, InterfaceImplementationAnalysis } from "./analysis/index.js";
import { InterfaceDifferenceKind, InterfaceField, InterfaceFunction, InterfaceMember, InterfaceProperty } from "./index.js";

export class Interface {
    static extract(type: Function): Interface;
    static extract(type: Type): Interface;
    static extract(type: any): Interface;
    static extract(type: any): Interface {
        function* generateInterfaceMembers(type: Type): Generator<InterfaceMember> {
            function generateInterfaceMember(member: MemberInfo): InterfaceMember | undefined {
                switch (member.memberKind) {
                    case MemberKind.Method:
                        return new InterfaceFunction(member.name);
                    case MemberKind.Property:
                        return new InterfaceProperty(member.name);
                    case MemberKind.Field:
                        return new InterfaceField(member.name, (member as FieldInfo).type)
                }
            }

            const instanceMembers: Iterable<MemberInfo> = type.getMembers(MemberSelectionOptions.InstanceOnly | MemberSelectionOptions.Properties | MemberSelectionOptions.Methods);
            for (let member of instanceMembers)
                yield generateInterfaceMember(member)!;
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
                if (typeMember === undefined)
                    return InterfaceDifferenceKind.Missing;
                if (typeMember.memberKind != interfaceMember.memberType)
                    return InterfaceDifferenceKind.Invalid;
                /// TODO: Compare property type
                return InterfaceDifferenceKind.None;
            }

            let typeMembers = [...type.getMembers(MemberSelectionOptions.InstanceOnly | MemberSelectionOptions.Methods | MemberSelectionOptions.Properties)];
            for (let interfaceMember of _interface.members) {
                let typeMember = typeMembers.find(m => m.name === interfaceMember.name);

                let differenceType = getMemberDifferenceType(interfaceMember, typeMember);
                if (differenceType == InterfaceDifferenceKind.None)
                    continue;

                yield new InterfaceDifference(type, _interface, interfaceMember.name, differenceType);
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