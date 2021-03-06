import { MemberType } from "../reflection/index.js";
import { InterfaceMember } from "./index.js";

export class InterfaceProperty extends InterfaceMember {
    constructor(name: string) {
        super(name, MemberType.Property);
    }
}