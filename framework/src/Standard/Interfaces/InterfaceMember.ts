import { Type } from "../Types/index.js";
import { Interface, InterfaceMemberKey } from "./index.js";
import { ArgumentTypeException } from "../Exceptions/index.js"
import { MemberAttributes } from "../Types/index.js";

export class InterfaceMember {
    constructor(key: string | number | symbol, memberType: number, type: Type | Interface | null = null, attributes: number = MemberAttributes.Enumerable, isOptional: boolean = true) {
        if (typeof key !== "string" && typeof key !== "symbol")
            throw new ArgumentTypeException(`key`, key, String);
        if (typeof memberType !== "number")
            throw new ArgumentTypeException(`memberType`, memberType, Number);
        if (type !== null && !(type instanceof Type) && !(type instanceof Interface))
            throw new ArgumentTypeException(`valueType`, type, Type);
        if (typeof attributes !== "number")
            throw new ArgumentTypeException(`attributes`, attributes, Number);
        if (typeof isOptional !== "boolean")
            throw new ArgumentTypeException(`isOptional`, isOptional, Boolean);

        this.__key = key;
        this.__memberType = memberType;
        this.__type = type || null;
        this.__attributes = attributes;
        this.__isOptional = isOptional;
    }

    get key(): InterfaceMemberKey { return this.__key; }
    private __key: InterfaceMemberKey;

    get memberType(): number { return this.__memberType; }
    private __memberType: number;

    get type(): Type | Interface | null { return this.__type; }
    private __type: Type | Interface | null;

    get attributes(): number { return this.__attributes; }
    private __attributes: number;

    get isOptional(): boolean { return this.__isOptional; }
    private __isOptional: boolean;
}