import { MemberType } from "./MemberType.js";
import { InvalidOperationException, ArgumentTypeException } from "../Exceptions/index.js";
import { prot, getProtected } from "../AccessContexts/index.js";

export class MemberInfo {
    constructor(memberType: number, name: string) {
        if (typeof memberType != "number")
            throw new ArgumentTypeException("memberType");

        MemberType.assertFlag(memberType);

        prot(this, function () {
            this._memberType = memberType;
            this._name = name;
        });
    }

    protected _memberType!: number;
    protected _name!: string;

    get memberType(): number {
        return prot(this, function () {
            return this._memberType;
        });
    }

    get name(): string {
        return prot(this, function () {
            return this._name!;
        });
    }
}