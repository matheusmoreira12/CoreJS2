import { ArgumentTypeException, InvalidOperationException, InvalidTypeException } from "../Exceptions/index.js"
import { Interface } from "../Interfaces/index.js";
import { Class, MemberSelectionType, MemberType, MemberSelectionAttributes, MemberAttributes } from "./Types.js";
import { MemberInfo } from "./MemberInfo.js";
import { Enumeration } from "../index.js";
import { Attribute } from "./Metadata/Attributes/index.js";

import * as _AttributeRegistry from "./Metadata/Attributes/_Registry.js";

export class Type<T = any> {
    static get<T>(ctor: Class<T>): Type<T> {
        if (typeof ctor != "function")
            throw new ArgumentTypeException("ctor", Function);

        let result = new Type();
        result.__initializeWithClass(ctor);

        return result;
    }

    static of<T>(instance: T): Type<T> {
        let result = new Type();
        result.__initializeWithInstance(instance);

        return result;
    }

    private __initializeWithInstance(instance: T): void {
        this.__instance = instance;
        this.__hasInstance = true;

        if (instance !== null && instance !== undefined) {
            this._ctor = (<any>instance).constructor;
            this._hasCtor = true;
        }

        this.__isInitialized = true;
    }

    private __initializeWithClass(_class: Class<T>): void {
        this._ctor = _class;
        this._hasCtor = true;

        if (_class.prototype) {
            this.__instance = _class.prototype;
            this.__hasInstance = true;
        }

        this.__isInitialized = true;
    }

    private __checkInitializationStatus() {
        if (!this.__isInitialized)
            throw new InvalidOperationException("Type has not been initialized.");
    }

    get [Symbol.toStringTag]() {
        return `Type(${this.getName()})`;
    }

    getName(): string {
        this.__checkInitializationStatus();

        if (!this._hasCtor)
            return String(this.__instance);

        return (<Class<any>>this._ctor).name;
    }

    getMembers(selectionType: number = MemberSelectionType.Any, selectionAttributes: number = MemberSelectionAttributes.Any): MemberInfo[] {
        this.__checkInitializationStatus();

        function* generateMembers(this: Type<T>): Generator<MemberInfo> {
            if (!this._hasCtor) return;

            for (let name of Object.getOwnPropertyNames(this._ctor)) {
                const descriptor = Object.getOwnPropertyDescriptor(this._ctor, name);
                yield MemberInfo.fromPropertyDescriptor(this, <keyof T & string>name, <PropertyDescriptor>descriptor, true);
            }

            if (!this.__hasInstance) return;

            for (let name of Object.getOwnPropertyNames(this.__instance)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__instance, name);
                yield MemberInfo.fromPropertyDescriptor(this, <keyof T & string>name, <PropertyDescriptor>descriptor);
            }
        }

        function* selectMembers(this: Type<T>, members: Iterable<MemberInfo>): Generator<MemberInfo> {
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

    getAttributes<T extends Attribute = Attribute>(attribute?: Class<T>): T[] {
        if (attribute === undefined || attribute instanceof Attribute) {
            if (this._hasCtor)
                return <T[]>_AttributeRegistry.getRegisteredAttributes(this._ctor, null, attribute);
            else
                return [];
        }
        else
            throw new ArgumentTypeException("attribute");
    }

    _ctor: Class<any> | undefined = undefined;
    _hasCtor: boolean = false;
 
    private __instance: any | undefined;
    private __hasInstance: boolean = false;
    private __isInitialized: boolean = false;
}