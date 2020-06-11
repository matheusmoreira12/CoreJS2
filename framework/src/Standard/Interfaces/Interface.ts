import { Type } from "../Reflection/Type.js";
import { InterfaceMember } from "./InterfaceMember.js";
import { InterfaceImplementationAnalysis } from "./Analysis/index.js";

export class Interface {
    static extract(type: Function): Interface;
    static extract(type: Type): Interface;
    static extract(type: any): Interface;
    static extract(): Interface {
        //TODO: extract interface
        return new Interface();
    }

    static differ(type: Type, _interface: Interface): InterfaceImplementationAnalysis {
        //TODO: differ type from interface

        return new InterfaceImplementationAnalysis(type, _interface);
    }

    constructor(...members: InterfaceMember[]) {
        this.__members = members;
    }

    get members(): InterfaceMember[] { return this.__members; }
    private __members: InterfaceMember[];

    get isEmpty(): boolean { return this.members.length == 0; }
}