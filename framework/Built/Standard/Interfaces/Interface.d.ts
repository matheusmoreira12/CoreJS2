import { Enumeration } from "../Enumeration";
import { Type } from "../Types/Types";
export declare const InterfaceDifferenceKind: Enumeration<import("../Enumeration").EnumerationValue>;
export declare class InterfaceDifference {
    constructor(analizedType: Type, analizedInterface: Interface, propertyName: string, differenceType: number);
    readonly analizedType: Type;
    private __analizedType;
    readonly analizedInterface: Interface;
    private __analizedInterface;
    readonly propertyName: string | symbol;
    private __propertyName;
    readonly differenceType: number;
    private __differenceType;
}
export declare class InterfaceDifferAnalysis {
    constructor(analizedType: Type, analizedInterface: Interface, ...differences: InterfaceDifference[]);
    readonly analizedType: Type;
    private __analizedType;
    readonly analizedInterface: Interface;
    private __analizedInterface;
    readonly differences: InterfaceDifference[];
    private __differences;
}
export declare const InterfaceMemberType: Enumeration<import("../Enumeration").EnumerationValue>;
export declare class InterfaceMember {
    constructor(key: string | symbol, memberType: number, valueType?: Type, attributes?: number, isOptional?: any);
    readonly key: string | symbol;
    private __key;
    readonly memberType: number;
    private __memberType;
    readonly valueType: Type;
    private __valueType;
    readonly attributes: number;
    private __attributes;
    readonly isOptional: boolean;
    private __isOptional;
}
export declare class Interface {
    static extract(type: Type): Interface;
    static differ(type: Type, _interface: Interface): InterfaceDifferAnalysis;
    constructor(...members: InterfaceMember[]);
    readonly members: InterfaceMember[];
    private __members;
}
