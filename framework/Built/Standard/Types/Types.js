"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enumeration_1 = require("../Enumeration");
const Exceptions_1 = require("../Exceptions");
const utils_1 = require("../../Utils/utils");
const Interface_1 = require("../Interfaces/Interface");
exports.MemberSelectionAttributes = new Enumeration_1.Enumeration({
    Any: 0,
    Configurable: 1,
    Enumerable: 2,
    Writable: 4,
});
exports.MemberSelectionType = new Enumeration_1.Enumeration({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16,
    Any: 31,
});
class Type {
    constructor() {
        this.__instance = null;
        this.__hasInstance = false;
        this.__class = null;
        this.__hasClass = false;
        this.__initialized = false;
    }
    static get(_class) {
        if (!(_class instanceof Function))
            throw new Exceptions_1.ArgumentTypeException("_class");
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
        let instanceHasConstructor = utils_1.ObjectUtils.hasPrototype(instance);
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
            throw new Exceptions_1.InvalidOperationException("Type has not been initialized.");
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
            for (let key of utils_1.ObjectUtils.getOwnPropertyKeys(this.__class)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__class, key);
                yield Member.fromPropertyDescriptor(this, key, descriptor, true);
            }
            if (!this.__hasInstance)
                return;
            for (let key of utils_1.ObjectUtils.getOwnPropertyKeys(this.__instance)) {
                const descriptor = Object.getOwnPropertyDescriptor(this.__instance, key);
                yield Member.fromPropertyDescriptor(this, key, descriptor);
            }
        }
        function* selectMembers(members) {
            function memberTypeMatches(memberType) {
                let selectionHasFunction = exports.MemberSelectionType.contains(exports.MemberSelectionType.Function, selectionType), selectionHasProperty = exports.MemberSelectionType.contains(exports.MemberSelectionType.Property, selectionType), selectionHasField = exports.MemberSelectionType.contains(exports.MemberSelectionType.Field, selectionType), selectionHasStatic = exports.MemberSelectionType.contains(exports.MemberSelectionType.Static, selectionType), selectionHasInstance = exports.MemberSelectionType.contains(exports.MemberSelectionType.Instance, selectionType);
                let memberIsFunction = exports.MemberType.contains(exports.MemberType.Function, memberType), memberIsProperty = exports.MemberType.contains(exports.MemberType.Property, memberType), memberIsField = exports.MemberType.contains(exports.MemberType.Field, memberType), memberIsStatic = exports.MemberType.contains(exports.MemberType.Static, memberType), memberIsInstance = exports.MemberType.contains(exports.MemberType.Instance, memberType);
                if (!selectionHasFunction && memberIsFunction ||
                    !selectionHasProperty && memberIsProperty ||
                    !selectionHasField && memberIsField ||
                    !selectionHasStatic && memberIsStatic ||
                    !selectionHasInstance && memberIsInstance)
                    return false;
                return true;
            }
            function memberAttributesMatch(memberAttributes) {
                let selectionHasEnumerable = exports.MemberSelectionAttributes.contains(exports.MemberSelectionAttributes.Enumerable, selectionAttributes), selectionHasConfigurable = exports.MemberSelectionAttributes.contains(exports.MemberSelectionAttributes.Configurable, selectionAttributes), selectionHasWritable = exports.MemberSelectionAttributes.contains(exports.MemberSelectionAttributes.Writable, selectionAttributes);
                let memberIsEnumerable = exports.MemberAttributes.contains(exports.MemberAttributes.Enumerable, memberAttributes), memberIsConfigurable = exports.MemberAttributes.contains(exports.MemberAttributes.Configurable, memberAttributes), memberIsWritable = exports.MemberAttributes.contains(exports.MemberAttributes.Writable, memberAttributes);
                if (selectionHasEnumerable && !memberIsEnumerable ||
                    selectionHasConfigurable && !memberIsConfigurable ||
                    selectionHasWritable && !memberIsWritable)
                    return false;
                return true;
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
            throw new Exceptions_1.InvalidTypeException("selectionType", selectionType, Number);
        if (selectionAttributes !== undefined && typeof selectionAttributes !== "number")
            throw new Exceptions_1.InvalidTypeException("selectionAttributes", selectionAttributes, Number);
        selectionType = selectionType === undefined ? exports.MemberSelectionType.Any : selectionType;
        selectionAttributes = selectionAttributes === undefined ? exports.MemberSelectionAttributes.Any : selectionAttributes;
        let members = generateMembers.call(this);
        let resultsNeedSelection = selectionType === exports.MemberSelectionType.Any && selectionAttributes === exports.MemberSelectionAttributes.Any;
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
            throw new Exceptions_1.ArgumentTypeException("other");
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
        let analysis = Interface_1.Interface.differ(this, _interface);
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
exports.Type = Type;
exports.MemberAttributes = new Enumeration_1.Enumeration({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4
});
exports.MemberType = new Enumeration_1.Enumeration({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16
});
class Member {
    constructor(key, memberType, parentType, attributes, type) {
        if (this.constructor === Member)
            throw new Exceptions_1.InvalidOperationException("Invalid constructor");
        this.__key = key;
        this.__memberType = memberType;
        this.__parentType = parentType;
        this.__attributes = attributes;
        this.__type = type;
    }
    static fromPropertyDescriptor(parentType, key, descriptor, isStatic = false) {
        function getAttributesFromDescriptor(descriptor) {
            return (descriptor.writable ? exports.MemberAttributes.Writable : 0) |
                (descriptor.enumerable ? exports.MemberAttributes.Enumerable : 0) |
                (descriptor.configurable ? exports.MemberAttributes.Configurable : 0);
        }
        function getMemberType(value) {
            let memberIsFunction = value instanceof Function, memberIsProperty = !!descriptor.get || !!descriptor.set;
            return (isStatic ? exports.MemberType.Static : exports.MemberType.Instance) |
                (memberIsFunction ? exports.MemberType.Function : memberIsProperty ? exports.MemberType.Property : exports.MemberType.Field);
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
        if (this.__memberType === exports.MemberType.Property && this.__type.equals(other.__type))
            return false;
        return true;
    }
    get parentType() { return this.__parentType; }
    get type() { return this.__type; }
    get memberType() { return this.__memberType; }
    get key() { return this.__key; }
    get attributes() { return this.__attributes; }
}
exports.Member = Member;
