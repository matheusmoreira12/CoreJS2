import { Enumeration } from "../Enumeration";
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
    static __createFromMember(member: Member): InterfaceMember;
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
    constructor(...members: InterfaceMember[]);
    readonly members: InterfaceMember[];
    private __members;
}
export declare const MemberSelectionAttributes: Enumeration<number>;
export declare const MemberSelectionType: Enumeration<number>;
export declare class Type {
    private static __createTypeFromClass;
    private static __createTypeFromInstance;
    static get(_class: any): Type;
    static of(instance: any): Type;
    constructor();
    private __initializeWithInstance;
    private __initializeWithClass;
    getName(): string;
    getOwnMembers(selectionType?: number, selectionAttributes?: number): Generator<any, void, any>;
    getMembers(selectionType?: any, selectionAttributes?: any): Generator<any, void, any>;
    private __getEffectiveValue;
    equals(other: any): boolean;
    extends(other: any): boolean;
    equalsOrExtends(other: any): boolean;
    implements(_interface: any): boolean;
    getParentTypes(): any;
    private __getParentInstance;
    private __getParentClass;
    getParentType(): Type;
    __instance: any;
    __hasInstance: boolean;
    __class: Function;
    __hasClass: boolean;
    __typeofResult: string;
}
export declare const MemberAttributes: Enumeration<number>;
export declare const MemberType: Enumeration<number>;
export declare class Member {
    static __createFromPropertyDescriptor(parentType: Type, key: string | symbol, descriptor: PropertyDescriptor, isStatic?: boolean): Member;
    constructor(key: string | symbol, type: Type, parentType: Type, memberType: number, attributes: number);
    isSame(other: Member): boolean;
    readonly parentType: Type;
    protected __parentType: Type;
    readonly type: Type;
    protected __type: Type;
    readonly memberType: number;
    protected __memberType: number;
    readonly key: string | symbol;
    protected __key: string | symbol;
    readonly attributes: number;
    protected __attributes: number;
}
