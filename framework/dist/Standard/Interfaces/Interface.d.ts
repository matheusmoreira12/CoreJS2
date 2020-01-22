import { Type } from "../Types/Type.js";
import { InterfaceMember } from "./InterfaceMember.js";
import { InterfaceImplementationAnalysis } from "./Analysis/index.js";
export declare class Interface {
    static extract(type: Type): Interface;
    static differ(type: Type, _interface: Interface): InterfaceImplementationAnalysis;
    constructor(...members: InterfaceMember[]);
    get members(): InterfaceMember[];
    private __members;
    get isEmpty(): boolean;
}
