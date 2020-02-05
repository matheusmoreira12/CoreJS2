import { ArgumentTypeException, InvalidOperationException, InvalidTypeException, Enumeration } from "../index";
import { ObjectUtils } from "../../CoreBase/Utils/index";
import { Class, MemberInfo, MemberSelectionType, MemberType, MemberSelectionAttributes, MemberAttributes } from "./index";
import { Interface } from "../Interfaces/index";

export class Type<T = any> {
    static get<T>(_class: Class<T>): Type<T> {
        if (typeof _class != "function")
            throw new ArgumentTypeException("_class", Function);

        let result = new Type();
        result.__initializeWithClass(_class);

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

        let instanceHasConstructor = instance !== null && instance !== undefined;
        if (instanceHasConstructor)
            this.__initializeWithClass(<Class<T>>(<object><unknown>instance).constructor);

        this.__initialized = true;
    }

    private __initializeWithClass(_class: Class<T>): void {
        this.__class = _class;
        this.__hasClass = true;

        this.__initialized = true;
    }

    private __checkInitializationStatus() {
        if (!this.__initialized)
            throw new InvalidOperationException("Type has not been initialized.");
    }

    getName(): string {
        this.__checkInitializationStatus();

        if (!this.__hasClass)
            return String(this.__instance);

        return (<Class<any>>this.__class).name;
    }

    getOwnMembers(selectionType?: number, selectionAttributes?: number): MemberInfo[] {
        this.__checkInitializationStatus();

        function* generateMembers(this: Type<T>): Generator<MemberInfo> {
            if (!this.__hasClass) return;

            for (let key of ObjectUtils.getOwnPropertyKeys(this.__class)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__class, key);
                yield MemberInfo.fromPropertyDescriptor(this, <keyof T>key, <PropertyDescriptor>descriptor, true);
            }

            if (!this.__hasInstance) return;

            for (let key of ObjectUtils.getOwnPropertyKeys(this.__instance)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__instance, key);
                yield MemberInfo.fromPropertyDescriptor(this, <keyof T>key, <PropertyDescriptor>descriptor);
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

    getMembers(selectionType?: number, selectionAttributes?: number): MemberInfo[] {
        const ownMembers: MemberInfo[] = this.getOwnMembers(selectionType, selectionAttributes);

        const parentType = this.getParentType();
        if (parentType !== null) {
            const parentMembers: MemberInfo[] = parentType.getOwnMembers(selectionType, selectionAttributes);
            return [...ownMembers, ...parentMembers];
        }

        return ownMembers;
    }

    private __getEffectiveValue(): any {
        if (!this.__hasClass)
            return this.__instance;

        return this.__class;
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

        if (this.__hasClass) {
            if (this.__hasInstance) {
                let parentInstance = this.__getParentInstance(this.__instance);
                if (parentInstance !== null)
                    return Type.of(parentInstance);
            }
            else {
                let parentClass = this.__getParentClass(<Class<any>>this.__class);
                if (parentClass !== null)
                    return Type.get(parentClass);
            }
        }

        return null;
    }

    private __instance: any | undefined;
    private __hasInstance: boolean = false;
    private __class: Class<any> | undefined = undefined;
    private __hasClass: boolean = false;
    private __initialized: boolean = false;
}