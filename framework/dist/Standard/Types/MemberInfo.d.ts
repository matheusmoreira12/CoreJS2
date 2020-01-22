import { Type } from "./index.js";
export declare class MemberInfo<TParent = any, TValue = any> {
    static fromPropertyDescriptor<TParent>(parentType: Type<TParent>, key: keyof TParent, descriptor: PropertyDescriptor, isStatic?: boolean): MemberInfo<TParent, any>;
    constructor(key: keyof TParent, memberType: number, parentType: Type<TParent>, attributes: number, type: Type<TValue>);
    isSame(other: MemberInfo): boolean;
    get parentType(): Type<TParent>;
    protected __parentType: Type<TParent>;
    get type(): Type<TValue>;
    protected __type: Type<TValue>;
    get memberType(): number;
    protected __memberType: number;
    get key(): keyof TParent;
    protected __key: keyof TParent;
    get attributes(): number;
    protected __attributes: number;
}
