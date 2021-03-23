import { InterfaceMemberKey } from "./index.js";
import { InvalidOperationException } from "../Exceptions/index.js"
import { assertParams } from "../../Validation/index.js";

export abstract class InterfaceMember {
    constructor(name: string, memberType: number) {
        if (new.target === this.constructor)
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