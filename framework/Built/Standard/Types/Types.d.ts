import { Enumeration } from "../Enumeration";
export declare const MemberSelectionAttributes: Enumeration<number>;
export declare const MemberSelectionType: Enumeration<number>;
export declare class Type {
    static get(_class: any): Type;
    static of(instance: any): Type;
    private __initializeWithInstance;
    private __initializeWithClass;
    private __checkInitializationStatus;
    getName(): string;
    getOwnMembers(selectionType?: number, selectionAttributes?: number): Generator<Member>;
    getMembers(selectionType?: number, selectionAttributes?: number): Generator<Member>;
    private __getEffectiveValue;
    equals(other: any): boolean;
    extends(other: any): boolean;
    equalsOrExtends(other: any): boolean;
    implements(_interface: any): boolean;
    getParentTypes(): any;
    private __getParentInstance;
    private __getParentClass;
    getParentType(): Type;
    private __instance;
    private __hasInstance;
    private __class;
    private __hasClass;
    private __initialized;
}
export declare const MemberAttributes: Enumeration<number>;
export declare const MemberType: Enumeration<number>;
export declare class Member {
    static fromPropertyDescriptor(parentType: Type, key: string | symbol, descriptor: PropertyDescriptor, isStatic?: boolean): Member;
    constructor(key: string | symbol, memberType: number, parentType: Type, attributes: number, type: Type);
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
