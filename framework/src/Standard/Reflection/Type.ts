import { ArgumentTypeException, InvalidOperationException } from "../Exceptions/index.js"
import { Interface } from "../Interfaces/index.js";
import { Class } from "./Types.js";
import { MemberType, MemberInfo } from "./index.js";
import { MemberSelectionOptions } from "./MemberBindingOptions.js";
import { prot, getProtected } from "../AccessContexts/index.js";

export class Type extends MemberInfo {
    static get(ctor: Class<any>): Type {
        if (typeof ctor != "function")
            throw new ArgumentTypeException("ctor", Function);

        const name = ctor.name;
        const result = new Type(name);
        prot(result, function () {
            this._ctor = ctor;
            this._hasCtor = true;
            this._reference = null;
            this._hasReference = false;
        });
        return result;
    }

    static of(reference: any): Type {
        const ctorAvailable = reference !== undefined && reference !== null;
        let name: string;
        let ctor: Class<any> = null;
        if (ctorAvailable) {
            ctor = reference.constructor;
            name = ctor.name;
        }
        else
            name = String(reference);
        const result = new Type(name);
        prot(result, function () {
            this._ctor = ctor;
            this._hasCtor = ctorAvailable;
            this._reference = reference;
            this._hasReference = true;
        });
        return result;
    }

    constructor(name: string) {
        super(MemberType.Type, name);

        prot(this, function () {
            this._ctor = null;
            this._hasCtor = false;
            this._reference = null;
            this._hasReference = false;
            this._members = [];
            this._membersEvaluated = false;
        });
    }

    get [Symbol.toStringTag]() {
        return `Type(${this.name})`;
    }

    getMembers(options: number = MemberSelectionOptions.Any): MemberInfo[] {
        MemberSelectionOptions.assertFlag(options);

        return prot(this, function () {
            let members: MemberInfo[];
            if (this._membersEvaluated)
                members = this._members;
            else {
                members = [];
                //TODO: evaluate members
                this._members = members;
                this._membersEvaluated = true;
            }
            if (options === MemberSelectionOptions.Any)
                return members;
            else {
                const selectedMembers: MemberInfo[] = [];
                //TODO: select members
                return selectedMembers;
            }
        });
    }

    equals(other: Type): boolean {
        if (other instanceof Type) {
            const _this = getProtected(this);
            const _other = getProtected(other);
            if (_this._hasReference) {
                if (_other._hasReference)
                    return _this._reference === _other._reference;
                else if (_other._hasCtor)
                    return _this._reference.constructor === _other._ctor;
            }
            else if (_this._hasCtor) {
                if (_other._hasCtor)
                    return _this._ctor === _other._ctor;
                else if (_other._hasReference)
                    return _this._ctor === _other._reference.constructor;
            }
            throw new InvalidOperationException(ERR_INVALID_TYPE);
        }
        else
            throw new ArgumentTypeException("other");
    }

    extends(other: Type): boolean {
        let baseType = this.baseType;
        while (baseType !== null) {
            if (baseType.equals(other))
                return true;
            baseType = baseType.baseType;
        }
        return false;
    }

    matches(other: Type | Interface): boolean {
        if (other instanceof Interface)
            return this.implements(other);
        else
            return this.equals(other) || this.extends(other);
    }

    matchesAny(...others: (Type | Interface)[]) {
        for (let other of others) {
            if (this.matches(other))
                return true;
        }
        return false;
    }

    matchesAll(...others: (Type | Interface)[]) {
        for (let other of others) {
            if (!this.matches(other))
                return false;
        }
        return true;
    }

    implements(_interface: Interface) {
        let analysis = Interface.differ(this, _interface);
        if (analysis.isEmpty)
            return true;

        return false;
    }

    get baseType(): Type | null {
        return prot(this, function () {
            if (this._hasCtor) {
                if (this._hasReference) {
                    const baseReference = Object.getPrototypeOf(this._reference);
                    if (baseReference === null)
                        return null;
                    else
                        return Type.of(baseReference);
                }
                else {
                    const baseCtor = Object.getPrototypeOf(this._ctor);
                    if (baseCtor === null)
                        return null;
                    else
                        return Type.get(baseCtor);
                }
            }
            else
                return null;
        });
    }

    protected _ctor!: Class<any>;
    protected _hasCtor!: boolean;
    protected _reference!: any;
    protected _hasReference!: boolean;
    protected _members!: MemberInfo[];
    protected _membersEvaluated!: boolean;
}

const ERR_INVALID_TYPE = "Invalid Type instance.";