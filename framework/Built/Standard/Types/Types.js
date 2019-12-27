import { Enumeration } from "../Enumeration";
import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "../Exceptions";
import { ObjectUtils } from "../../Utils/utils";
import { Interface } from "../Interfaces/Interface";
export const MemberSelectionAttributes = new Enumeration({
    Any: 0,
    Configurable: 1,
    Enumerable: 2,
    Writable: 4,
});
export const MemberSelectionType = new Enumeration({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16,
    Any: 31,
});
export class Type {
    constructor() {
        this.__instance = null;
        this.__hasInstance = false;
        this.__class = null;
        this.__hasClass = false;
        this.__initialized = false;
    }
    static get(_class) {
        if (!(_class instanceof Function))
            throw new ArgumentTypeException("_class");
        let result = new Type();
        result.__initializeWithClass(_class);
        return result;
    }
    static of(instance) {
        let result = new Type();
        result.__initializeWithInstance(instance);
        return result;
    }
    __initializeWithInstance(instance) {
        this.__instance = instance;
        this.__hasInstance = true;
        let instanceHasConstructor = ObjectUtils.hasPrototype(instance);
        if (instanceHasConstructor)
            this.__initializeWithClass(instance.constructor);
        this.__initialized = true;
    }
    __initializeWithClass(_class) {
        this.__class = _class;
        this.__hasClass = true;
        this.__initialized = true;
    }
    __checkInitializationStatus() {
        if (!this.__initialized)
            throw new InvalidOperationException("Type has not been initialized.");
    }
    getName() {
        this.__checkInitializationStatus();
        if (!this.__hasClass)
            return String(this.__instance);
        return this.__class.name;
    }
    *getOwnMembers(selectionType, selectionAttributes) {
        this.__checkInitializationStatus();
        function* generateMembers() {
            if (!this.__hasClass)
                return;
            for (let key of ObjectUtils.getOwnPropertyKeys(this.__class)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__class, key);
                yield Member.fromPropertyDescriptor(this, key, descriptor, true);
            }
            if (!this.__hasInstance)
                return;
            for (let key of ObjectUtils.getOwnPropertyKeys(this.__instance)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__instance, key);
                yield Member.fromPropertyDescriptor(this, key, descriptor);
            }
        }
        function* selectMembers(members) {
            function memberTypeMatches(memberType) {
                const selectionHasFunction = MemberSelectionType.contains(MemberSelectionType.Function, selectionType), selectionHasProperty = MemberSelectionType.contains(MemberSelectionType.Property, selectionType), selectionHasField = MemberSelectionType.contains(MemberSelectionType.Field, selectionType), selectionHasStatic = MemberSelectionType.contains(MemberSelectionType.Static, selectionType), selectionHasInstance = MemberSelectionType.contains(MemberSelectionType.Instance, selectionType);
                const memberIsFunction = MemberType.contains(MemberType.Function, memberType), memberIsProperty = MemberType.contains(MemberType.Property, memberType), memberIsField = MemberType.contains(MemberType.Field, memberType), memberIsStatic = MemberType.contains(MemberType.Static, memberType), memberIsInstance = MemberType.contains(MemberType.Instance, memberType);
                return !(!selectionHasFunction && memberIsFunction || !selectionHasProperty && memberIsProperty || !selectionHasField && memberIsField || !selectionHasStatic && memberIsStatic || !selectionHasInstance && memberIsInstance);
            }
            function memberAttributesMatch(memberAttributes) {
                const selectionHasEnumerable = MemberSelectionAttributes.contains(MemberSelectionAttributes.Enumerable, selectionAttributes), selectionHasConfigurable = MemberSelectionAttributes.contains(MemberSelectionAttributes.Configurable, selectionAttributes), selectionHasWritable = MemberSelectionAttributes.contains(MemberSelectionAttributes.Writable, selectionAttributes);
                const memberIsEnumerable = MemberAttributes.contains(MemberAttributes.Enumerable, memberAttributes), memberIsConfigurable = MemberAttributes.contains(MemberAttributes.Configurable, memberAttributes), memberIsWritable = MemberAttributes.contains(MemberAttributes.Writable, memberAttributes);
                return !(selectionHasEnumerable && !memberIsEnumerable || selectionHasConfigurable && !memberIsConfigurable || selectionHasWritable && !memberIsWritable);
            }
            for (let member of members) {
                if (!memberTypeMatches(member.memberType))
                    continue;
                if (!memberAttributesMatch(member.attributes))
                    continue;
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
        let resultsNeedSelection = selectionType === MemberSelectionType.Any && selectionAttributes === MemberSelectionAttributes.Any;
        if (resultsNeedSelection) {
            let selectedMembers = selectMembers.call(this, members);
            yield* selectedMembers;
        }
        else
            yield* members;
    }
    *getMembers(selectionType, selectionAttributes) {
        yield* this.getOwnMembers(selectionType, selectionAttributes);
        for (let parentType of this.getParentTypes())
            yield* parentType.getOwnMembers(selectionType, selectionAttributes);
    }
    __getEffectiveValue() {
        if (!this.__hasClass)
            return this.__instance;
        return this.__class;
    }
    equals(other) {
        this.__checkInitializationStatus();
        if (!(other instanceof Type))
            throw new ArgumentTypeException("other");
        return this.__getEffectiveValue() === other.__getEffectiveValue();
    }
    extends(other) {
        this.__checkInitializationStatus();
        for (let type of this.getParentTypes()) {
            if (type.equals(other))
                return true;
        }
        return false;
    }
    equalsOrExtends(other) {
        this.__checkInitializationStatus();
        return this.equals(other) || this.extends(other);
    }
    implements(_interface) {
        this.__checkInitializationStatus();
        let analysis = Interface.differ(this, _interface);
        if (analysis.isEmpty)
            return true;
        return false;
    }
    *getParentTypes() {
        let parentType = this.getParentType();
        if (parentType === null)
            return;
        yield parentType;
        yield* parentType.getParentTypes();
    }
    __getParentInstance(instance) {
        let parentInstance = Object.getPrototypeOf(instance);
        return parentInstance;
    }
    __getParentClass(_class) {
        let parentClass = Object.getPrototypeOf(_class);
        if (parentClass instanceof Function)
            return parentClass;
        return null;
    }
    getParentType() {
        this.__checkInitializationStatus();
        if (this.__hasClass) {
            if (this.__hasInstance) {
                let parentInstance = this.__getParentInstance(this.__instance);
                if (parentInstance !== null)
                    return Type.of(parentInstance);
            }
            else {
                let parentClass = this.__getParentClass(this.__class);
                if (parentClass !== null)
                    return Type.get(parentClass);
            }
        }
        return null;
    }
}
export const MemberAttributes = new Enumeration({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4
});
export const MemberType = new Enumeration({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16
});
export class Member {
    constructor(key, memberType, parentType, attributes, type) {
        if (this.constructor === Member)
            throw new InvalidOperationException("Invalid constructor");
        this.__key = key;
        this.__memberType = memberType;
        this.__parentType = parentType;
        this.__attributes = attributes;
        this.__type = type;
    }
    static fromPropertyDescriptor(parentType, key, descriptor, isStatic = false) {
        function getAttributesFromDescriptor(descriptor) {
            return (descriptor.writable ? MemberAttributes.Writable : 0) | (descriptor.enumerable ? MemberAttributes.Enumerable : 0) | (descriptor.configurable ? MemberAttributes.Configurable : 0);
        }
        function getMemberType(value) {
            const memberIsFunction = value instanceof Function, memberIsProperty = !!descriptor.get || !!descriptor.set;
            return (isStatic ? MemberType.Static : MemberType.Instance) | (memberIsFunction ? MemberType.Function : memberIsProperty ? MemberType.Property : MemberType.Field);
        }
        const attributes = getAttributesFromDescriptor(descriptor);
        const value = descriptor.value;
        const memberType = getMemberType(value);
        const type = Type.of(value);
        return new Member(key, memberType, parentType, attributes, type);
    }
    isSame(other) {
        if (this.__key !== other.__key)
            return false;
        if (this.__memberType !== other.memberType)
            return false;
        if (this.__memberType === MemberType.Property && this.__type.equals(other.__type))
            return false;
        return true;
    }
    get parentType() { return this.__parentType; }
    get type() { return this.__type; }
    get memberType() { return this.__memberType; }
    get key() { return this.__key; }
    get attributes() { return this.__attributes; }
}
