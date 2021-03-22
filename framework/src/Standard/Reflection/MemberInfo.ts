import { Type, MemberAttributes, MemberType } from "./index.js";
import { Attribute } from "./Metadata/Attributes/index.js";
import { Class } from "./Types.js";

import * as _AttributeRegistry from "./Metadata/Attributes/_Registry.js";

export class MemberInfo<TParent = any, TValue = any> {
    static fromPropertyDescriptor<TParent>(parentType: Type<TParent>, name: keyof TParent & string, descriptor: PropertyDescriptor, isStatic: boolean = false): MemberInfo<TParent, any> {
        function getAttributesFromDescriptor(): number {
            return (descriptor.writable ? MemberAttributes.Writable : 0) | (descriptor.enumerable ? MemberAttributes.Enumerable : 0) | (descriptor.configurable ? MemberAttributes.Configurable : 0);
        }

        function getMemberType(): number {
            const memberIsFunction: boolean = value instanceof Function,
                memberIsProperty: boolean = !!descriptor.get || !!descriptor.set;

            return (isStatic ? MemberType.Static : MemberType.Instance) | (memberIsProperty ? MemberType.Property : (memberIsFunction ? MemberType.Function : MemberType.Field));
        }

        const attributes = getAttributesFromDescriptor();
        const value = <TParent[typeof name]>descriptor.value;
        const memberType = getMemberType();
        const type = Type.of(value);
        return new MemberInfo(name, memberType, parentType, attributes, type);
    }

    constructor(name: keyof TParent & string, memberType: number, parentType: Type<TParent>, attributes: number, type: Type<TValue>) {
        this.__key = name;
        this.__memberType = memberType;
        this.__parentType = parentType;
        this.__attributes = attributes;
        this.__type = type;
    }

    isSame(other: MemberInfo) {
        if (this.__key !== other.__key)
            return false;
        else if (this.__memberType !== other.memberType)
            return false;
        else if (this.__memberType === MemberType.Property && this.__type.equals(other.__type))
            return false;
        else
            return true;
    }

    getAttributes<T extends Attribute = Attribute>(attribute?: Class<T>): T[] {
        if (this.__parentType._hasCtor)
            return <T[]>_AttributeRegistry.getRegisteredAttributes(this.parentType._ctor, <string | symbol>this.key, attribute);
        else
            return [];
    }

    get parentType(): Type<TParent> { return this.__parentType; }
    protected __parentType: Type<TParent>;

    get type(): Type<TValue> { return this.__type; }
    protected __type: Type<TValue>;

    get memberType(): number { return this.__memberType; }
    protected __memberType: number;

    get key(): keyof TParent & string { return this.__key; }
    protected __key: keyof TParent & string;

    get attributes(): number { return this.__attributes; }
    protected __attributes: number;
}