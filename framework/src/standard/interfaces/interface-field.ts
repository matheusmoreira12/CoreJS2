import { assertParams } from "../../validation/index.js";
import { MemberKind, Type } from "../reflection/index.js";
import { Interface, InterfaceMember } from "./index.js";
import { InterfaceMemberKey } from "./interface-member-key.js";

export class InterfaceField extends InterfaceMember {
    constructor(name: InterfaceMemberKey, valueType: Type | Interface | null) {
        super(name, MemberKind.Field);

        assertParams({ valueType }, [Type, Interface, Type.of(null)]);

        this.__type = valueType;
    }

    protected __type: Type | Interface | null;

    get type() { return this.__type }
}