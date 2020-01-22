import { Type } from "../Types/index.js";
import { Interface, InterfaceMemberKey } from "./index.js";
export declare class InterfaceMember {
    constructor(key: string | number | symbol, memberType: number, type?: Type | Interface, attributes?: number, isOptional?: boolean);
    get key(): InterfaceMemberKey;
    private __key;
    get memberType(): number;
    private __memberType;
    get type(): Type | Interface | null;
    private __type;
    get attributes(): number;
    private __attributes;
    get isOptional(): boolean;
    private __isOptional;
}
