import { InvalidOperationException } from "../exceptions/index.js"
import { assertParams } from "../../validation/index.js";
import { InterfaceMemberKey } from "./interface-member-key.js";

export abstract class InterfaceMember {
    constructor(name: InterfaceMemberKey, memberType: number) {
        if (new.target === InterfaceMember)
            throw new InvalidOperationException("Invalid constructor.");

        assertParams({ key: name }, [String]);

        this.__name = name;
        this.__memberType = memberType;
    }

    get name(): InterfaceMemberKey { return this.__name; }
    private __name: InterfaceMemberKey;

    get memberType(): number { return this.__memberType; }
    private __memberType: number;
}