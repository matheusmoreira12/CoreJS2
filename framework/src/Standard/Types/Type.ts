import { ArgumentTypeException, InvalidOperationException, InvalidTypeException, Enumeration } from "../index";
import { Interface } from "../Interfaces/index";
import { Class, MemberSelectionType, MemberType, MemberSelectionAttributes, MemberAttributes } from "./Types";
import { MemberInfo } from "./MemberInfo";

//Keys for Type
const $checkInitializationStatus = Symbol();
const $class = Symbol();
const $getEffectiveValue = Symbol();
const $getParentClass = Symbol();
const $getParentInstance = Symbol();
const $hasClass = Symbol();
const $hasInstance = Symbol();
const $isInitialized = Symbol();
const $initializeWithClass = Symbol();
const $initializeWithInstance = Symbol();
const $instance = Symbol();

export class Type<T = any> {
    static get<T>(_class: Class<T>): Type<T> {
        if (typeof _class != "function")
            throw new ArgumentTypeException("_class", Function);

        let result = new Type();
        result[$initializeWithClass](_class);

        return result;
    }

    static of<T>(instance: T): Type<T> {
        let result = new Type();
        result[$initializeWithInstance](instance);

        return result;
    }

    private [$initializeWithInstance](instance: T): void {
        this[$instance] = instance;
        this[$hasInstance] = true;

        if (instance !== null && instance !== undefined) {
            this[$class] = (<any>instance).constructor;
            this[$hasClass] = true;
        }

        this[$isInitialized] = true;
    }

    private [$initializeWithClass](_class: Class<T>): void {
        this[$class] = _class;
        this[$hasClass] = true;

        if (_class.prototype) {
            this[$instance] = _class.prototype;
            this[$hasInstance] = true;
        }

        this[$isInitialized] = true;
    }

    private [$checkInitializationStatus]() {
        if (!this[$isInitialized])
            throw new InvalidOperationException("Type has not been initialized.");
    }

    get [Symbol.toStringTag]() {
        return `Type(${this.getName()})`;
    }

    getName(): string {
        this[$checkInitializationStatus]();

        if (!this[$hasClass])
            return String(this[$instance]);

        return (<Class<any>>this[$class]).name;
    }

    getMembers(selectionType: number = MemberSelectionType.Any, selectionAttributes: number = MemberSelectionAttributes.Any): MemberInfo[] {
        this[$checkInitializationStatus]();

        function* generateMembers(this: Type<T>): Generator<MemberInfo> {
            if (!this[$hasClass]) return;

            for (let name of Object.getOwnPropertyNames(this[$class])) {
                const descriptor = Object.getOwnPropertyDescriptor(this[$class], name);
                yield MemberInfo.fromPropertyDescriptor(this, <keyof T>name, <PropertyDescriptor>descriptor, true);
            }

            if (!this[$hasInstance]) return;

            for (let name of Object.getOwnPropertyNames(this[$instance])) {
                const descriptor = Object.getOwnPropertyDescriptor(this[$instance], name);
                yield MemberInfo.fromPropertyDescriptor(this, <keyof T>name, <PropertyDescriptor>descriptor);
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

    private [$getEffectiveValue](): any {
        if (!this[$hasClass])
            return this[$instance];

        return this[$class];
    }

    equals(other: Type): boolean {
        this[$checkInitializationStatus]();

        if (!(other instanceof Type))
            throw new ArgumentTypeException("other");

        return this[$getEffectiveValue]() === other[$getEffectiveValue]();
    }

    extends(other: Type): boolean {
        this[$checkInitializationStatus]();

        for (let type of this.getParentTypes()) {
            if (type.equals(other))
                return true;
        }

        return false;
    }

    matches(other: Type | Interface): boolean {
        this[$checkInitializationStatus]();

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
        this[$checkInitializationStatus]();

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

    private [$getParentInstance](instance: any): any {
        let parentInstance = Object.getPrototypeOf(instance);
        return parentInstance;
    }

    private [$getParentClass](_class: Class<any>): Class<any> | null {
        let parentClass = Object.getPrototypeOf(_class);
        if (typeof parentClass == "function")
            return parentClass;

        return null;
    }

    getParentType(): Type | null {
        this[$checkInitializationStatus]();

        if (this[$hasClass]) {
            if (this[$hasInstance]) {
                let parentInstance = this[$getParentInstance](this[$instance]);
                if (parentInstance !== null)
                    return Type.of(parentInstance);
            }
            else {
                let parentClass = this[$getParentClass](<Class<any>>this[$class]);
                if (parentClass !== null)
                    return Type.get(parentClass);
            }
        }

        return null;
    }

    private [$instance]: any | undefined;
    private [$hasInstance]: boolean = false;
    private [$class]: Class<any> | undefined = undefined;
    private [$hasClass]: boolean = false;
    private [$isInitialized]: boolean = false;
}