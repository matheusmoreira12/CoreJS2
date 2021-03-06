import { assertParams } from "../../validation/index.js";
import { ClassOf, MemberType, Type } from "../reflection/index.js";
import { Interface, InterfaceMember } from "./index.js";

export class InterfaceField extends InterfaceMember {
    constructor(name: string, valueType: Type | Interface | null) {
        super(name, MemberType.Field);

        assertParams({ valueType }, [Type, Interface, Type.of(null)]);

        this.__type = valueType;
    }

    protected __type: Type | Interface | null;

    get type() { return this.__type }
}