import { Type, MemberAttributes, MemberType } from "./index.js";

export class MemberInfo<TParent = any, TValue = any> {
    static fromPropertyDescriptor<TParent>(parentType: Type<TParent>, key: keyof TParent, descriptor: PropertyDescriptor, isStatic: boolean = false): MemberInfo<TParent, any> {
        function getAttributesFromDescriptor(): number {
            return (descriptor.writable ? MemberAttributes.Writable : 0) | (descriptor.enumerable ? MemberAttributes.Enumerable : 0) | (descriptor.configurable ? MemberAttributes.Configurable : 0);
        }

        function getMemberType(): number {
            const memberIsFunction: boolean = value instanceof Function,
                memberIsProperty: boolean = !!descriptor.get || !!descriptor.set;

            return (isStatic ? MemberType.Static : MemberType.Instance) | (memberIsFunction ? MemberType.Function : memberIsProperty ? MemberType.Property : MemberType.Field);
        }

        const attributes = getAttributesFromDescriptor();
        const value = <TParent[typeof key]>descriptor.value;
        const memberType = getMemberType();
        const type = Type.of(value);
        return new MemberInfo(key, memberType, parentType, attributes, type);
    }

    constructor(key: keyof TParent, memberType: number, parentType: Type<TParent>, attributes: number, type: Type<TValue>) {
        this.__key = key;
        this.__memberType = memberType;
        this.__parentType = parentType;
        this.__attributes = attributes;
        this.__type = type;
    }

    isSame(other: MemberInfo) {
        if (this.__key !== other.__key) return false;
        if (this.__memberType !== other.memberType) return false;
        if (this.__memberType === MemberType.Property && this.__type.equals(other.__type)) return false;

        return true;
    }

    get parentType(): Type<TParent> { return this.__parentType; }
    protected __parentType: Type<TParent>;

    get type(): Type<TValue> { return this.__type; }
    protected __type: Type<TValue>;

    get memberType(): number { return this.__memberType; }
    protected __memberType: number;

    get key(): keyof TParent { return this.__key; }
    protected __key: keyof TParent;

    get attributes(): number { return this.__attributes; }
    protected __attributes: number;
}