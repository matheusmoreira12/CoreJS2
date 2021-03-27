import { MemberType } from "./member-type.js";
import { ArgumentTypeException, InvalidOperationException } from "../exceptions/index.js";

export class MemberInfo {
    constructor(memberType: number, name: string) {
        if (new.target === MemberInfo)
            throw new InvalidOperationException("Invalid constructor.");

        if (typeof memberType != "number")
            throw new ArgumentTypeException("memberType");

        MemberType.assertFlag(memberType);
    
        this._memberType = memberType;
        this._name = name;
    }

    protected _memberType: number;
    protected _name: string;

    get memberType(): number {
        return this._memberType;
    }

    get name(): string {
        return this._name;
    }
}