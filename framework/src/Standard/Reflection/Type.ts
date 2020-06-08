import { ArgumentTypeException, InvalidOperationException, InvalidTypeException } from "../Exceptions/index.js"
import { Interface } from "../Interfaces/index.js";
import { Class } from "./Types.js";
import { MemberSelectionAttributes } from "./MemberSelectionAttributes";
import { MemberType } from "./MemberType";
import { MemberAttributes } from "./MemberAttributes";
import { MemberSelectionType } from "./MemberSelectionType";
import { MemberInfo } from "./MemberInfo.js";
import { Enumeration } from "../index.js";
import { TypeMetadata } from "./~TypeMetadata.js";
import { storeMetadata } from "./~Storage.js";

export class Type extends MemberInfo {
    static get(ctor: Class<any>): Type {
        if (typeof ctor != "function")
            throw new ArgumentTypeException("ctor", Function);

        const result = new Type();
        const metadata: TypeMetadata = {
            //MemberInfo metadata
            name: ctor.name,
            memberType: MemberType.Type,
            flags: [],
            declaringType: null,
            reflectedType: result,
            //Type metadata
            ctor,
            ctorAvailable: true,
            reference: undefined,
            referenceAvailable: false,
            members: [],
            membersEvaluated: false
        };
        result._metadataToken = storeMetadata(metadata);
        return result;
    }

    static of(reference: any): Type {
        const ctorAvailable = reference !== undefined && reference !== null;
        const ctor = ctorAvailable ? reference.constructor : undefined;
        const name = ctorAvailable ? ctor.name : typeof reference;
        const result = new Type();
        const metadata: TypeMetadata = {
            //MemberInfo metadata
            name,
            memberType: MemberType.Type,
            flags: [],
            declaringType: null,
            reflectedType: result,
            //Type metadata
            ctor,
            ctorAvailable,
            reference,
            referenceAvailable: true,
            members: [],
            membersEvaluated: false
        }
        result._metadataToken = storeMetadata(metadata);
        return result;
    }

    get [Symbol.toStringTag]() {
        return `Type(${this.name})`;
    }

    getMembers(selectionType: number = MemberSelectionType.Any, selectionAttributes: number = MemberSelectionAttributes.Any): MemberInfo[] {
        this.__checkInitializationStatus();

        function* generateMembers(this: Type): Generator<MemberInfo> {
            if (!this._hasCtor) return;

            for (let name of Object.getOwnPropertyNames(this._ctor)) {
                const descriptor = Object.getOwnPropertyDescriptor(this._ctor, name);
                yield MemberInfo.fromPropertyDescriptor(this, <keyof T & string>name, <PropertyDescriptor>descriptor, true);
            }

            if (!this.__hasInstance) return;

            for (let name of Object.getOwnPropertyNames(this.__instance)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__instance, name);
                yield MemberInfo.fromPropertyDescriptor(this, name, <PropertyDescriptor>descriptor);
            }
        }

        function* selectMembers(this: Type, members: Iterable<MemberInfo>): Generator<MemberInfo> {
            function memberTypeMatches(memberType: number): boolean {
                const selectionHasFunction: boolean = Enumeration.contains(MemberSelectionType.Function, <number>selectionType),
                    selectionHasProperty: boolean = Enumeration.contains(MemberSelectionType.Property, <number>selectionType),
                    selectionHasField: boolean = Enumeration.contains(MemberSelectionType.Field, <number>selectionType),
                    selectionHasStatic: boolean = Enumeration.contains(MemberSelectionType.Static, <number>selectionType),
                    selectionHasInstance: boolean = Enumeration.contains(MemberSelectionType.Instance, <number>selectionType);

                const memberIsFunction: boolean = Enumeration.contains(MemberType.Function, memberType),
                    memberIsProperty: boolean = Enumeration.contains(MemberType.Property, memberType),
                    memberIsField: boolean = Enumeration.contains(MemberType.Field, memberType),
                    memberIsStatic: boolean = Enumeration.contains(MemberType.Static, memberType),
                    memberIsInstance: boolean = Enumeration.contains(MemberType.Instance, memberType);

                return !(!selectionHasFunction && memberIsFunction || !selectionHasProperty && memberIsProperty || !selectionHasField && memberIsField || !selectionHasStatic && memberIsStatic || !selectionHasInstance && memberIsInstance);
            }

            function memberAttributesMatch(memberAttributes: number): boolean {
                const selectionHasEnumerable = Enumeration.contains(MemberSelectionAttributes.Enumerable, <number>selectionAttributes),
                    selectionHasConfigurable = Enumeration.contains(MemberSelectionAttributes.Configurable, <number>selectionAttributes),
                    selectionHasWritable = Enumeration.contains(MemberSelectionAttributes.Writable, <number>selectionAttributes);

                const memberIsEnumerable = Enumeration.contains(MemberAttributes.Enumerable, memberAttributes),
                    memberIsConfigurable = Enumeration.contains(MemberAttributes.Configurable, memberAttributes),
                    memberIsWritable = Enumeration.contains(MemberAttributes.Writable, memberAttributes);

                return !(selectionHasEnumerable && !memberIsEnumerable || selectionHasConfigurable && !memberIsConfigurable || selectionHasWritable && !memberIsWritable);
            }

            for (let member of members) {
                if (!memberTypeMatches(member.memberType)) continue;
                if (!memberAttributesMatch(member.attributes)) continue;

                yield member;
            }
        }

        if (selectionType !== undefined && typeof selectionType !== "number")
            throw new InvalidTypeException("selectionType", selectionType, Number);
        if (selectionAttributes !== undefined && typeof selectionAttributes !== "number")
            throw new InvalidTypeException("selectionAttributes", selectionAttributes, Number);

        selectionType = selectionType === undefined ? MemberSelectionType.Any : selectionType;
        selectionAttributes = selectionAttributes === undefined ? MemberSelectionAttributes.Any : selectionAttributes;

        let members = generateMembers.call(this);

        const resultsNeedSelection = selectionType === MemberSelectionType.Any && selectionAttributes === MemberSelectionAttributes.Any;
        if (resultsNeedSelection) {
            let selectedMembers = selectMembers.call(this, members);
            return [...selectedMembers];
        }
        else
            return [...members];
    }

    getAllMembers(selectionType: number = MemberSelectionType.Any, selectionAttributes: number = MemberSelectionAttributes.Any): MemberInfo[] {
        const ownMembers: MemberInfo[] = this.getMembers(selectionType, selectionAttributes);

        const parentType = this.getParentType();
        if (parentType !== null) {
            const parentMembers: MemberInfo[] = parentType.getMembers(selectionType, selectionAttributes);
            return [...ownMembers, ...parentMembers];
        }

        return ownMembers;
    }

    private __getEffectiveValue(): any {
        if (!this._hasCtor)
            return this.__instance;

        return this._ctor;
    }

    equals(other: Type): boolean {
        this.__checkInitializationStatus();

        if (!(other instanceof Type))
            throw new ArgumentTypeException("other");

        return this.__getEffectiveValue() === other.__getEffectiveValue();
    }

    extends(other: Type): boolean {
        this.__checkInitializationStatus();

        for (let type of this.getParentTypes()) {
            if (type.equals(other))
                return true;
        }

        return false;
    }

    matches(other: Type | Interface): boolean {
        this.__checkInitializationStatus();

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
        this.__checkInitializationStatus();

        let analysis = Interface.differ(this, _interface);
        if (analysis.isEmpty)
            return true;

        return false;
    }

    getParentTypes(): Type[] {
        let parentType = this.getParentType();
        if (parentType === null)
            return [];

        return [parentType, ...parentType.getParentTypes()];
    }

    private __getParentInstance(instance: any): any {
        let parentInstance = Object.getPrototypeOf(instance);
        return parentInstance;
    }

    private __getParentClass(_class: Class<any>): Class<any> | null {
        let parentClass = Object.getPrototypeOf(_class);
        if (typeof parentClass == "function")
            return parentClass;

        return null;
    }

    getParentType(): Type | null {
        this.__checkInitializationStatus();

        if (this._hasCtor) {
            if (this.__hasInstance) {
                let parentInstance = this.__getParentInstance(this.__instance);
                if (parentInstance !== null)
                    return Type.of(parentInstance);
            }
            else {
                let parentClass = this.__getParentClass(<Class<any>>this._ctor);
                if (parentClass !== null)
                    return Type.get(parentClass);
            }
        }

        return null;
    }
}