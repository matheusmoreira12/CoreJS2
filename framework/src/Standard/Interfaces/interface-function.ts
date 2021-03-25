import { MemberType } from "../Reflection/index.js";
import { InterfaceMember } from "./index.js";

export class InterfaceFunction extends InterfaceMember {
    constructor(name: string) {
        super(name, MemberType.Function);
    }
}