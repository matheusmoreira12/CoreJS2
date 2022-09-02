import { MemberType } from "../reflection/index.js";
import { InterfaceMember } from "./index.js";
import { InterfaceMemberKey } from "./interface-member-key.js";

export class InterfaceProperty extends InterfaceMember {
    constructor(name: InterfaceMemberKey) {
        super(name, MemberType.Property);
    }
}