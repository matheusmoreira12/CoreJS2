import { Enumeration } from "../Enumeration";
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
    getMembers(selectionType?: number, selectionAttributes?: number): Generator<any, void, any>;
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
    get parentType(): Type;
    protected __parentType: Type;
    get type(): Type;
    protected __type: Type;
    get memberType(): number;
    protected __memberType: number;
    get key(): string | symbol;
    protected __key: string | symbol;
    get attributes(): number;
    protected __attributes: number;
}
