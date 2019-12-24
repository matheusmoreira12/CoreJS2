import { Enumeration } from "../Enumeration";
import { Type, Member } from "../Types/Types";
export declare const InterfaceDifferenceKind: Enumeration<import("../Enumeration").EnumerationValue>;
export declare class InterfaceDifference {
    constructor(analizedType: Type, analizedInterface: Interface, propertyName: string, differenceType: number);
    get analizedType(): Type;
    private __analizedType;
    get analizedInterface(): Interface;
    private __analizedInterface;
    get propertyName(): string | symbol;
    private __propertyName;
    get differenceType(): number;
    private __differenceType;
}
export declare class InterfaceDifferAnalysis {
    constructor(analizedType: Type, analizedInterface: Interface, ...differences: InterfaceDifference[]);
    get analizedType(): Type;
    private __analizedType;
    get analizedInterface(): Interface;
    private __analizedInterface;
    get differences(): InterfaceDifference[];
    private __differences;
}
export declare const InterfaceMemberType: Enumeration<import("../Enumeration").EnumerationValue>;
export declare class InterfaceMember {
    static __extractFromMember(member: Member): InterfaceMember;
    constructor(key: string | symbol, memberType: number, valueType?: Type, attributes?: number, isOptional?: any);
    get key(): string | symbol;
    private __key;
    get memberType(): number;
    private __memberType;
    get valueType(): Type;
    private __valueType;
    get attributes(): number;
    private __attributes;
    get isOptional(): boolean;
    private __isOptional;
}
export declare class Interface {
    static extract(type: Type): Interface;
    constructor(...members: InterfaceMember[]);
    get members(): InterfaceMember[];
    private __members;
}
