import { Dictionary, Collection } from "./Standard.Collections.js";
import { Enumeration } from "./Standard.Enumeration.js";
import { ArgumentTypeException, InvalidTypeException, InvalidOperationException } from "./exceptions.js";

let closureMap = new WeakMap();

class InterfaceMemberClosure {
    constructor(target, name, type, attributes, isOptional) {
        this.target = target;

        this.name = name;
        this.type = type;
        this.attributes = attributes;
        this.isOptional = isOptional;
    }
}

export class InterfaceMember {
    constructor(name, type = null, attributes = 0, isOptional = false) {
        if (!Type.of(name).equals(Type.get(String)))
            throw new ArgumentTypeException(`name`, Type.of(name));
        if (type !== null && !Type.of(type).equals(Type.get(Type)) && !Type.of(type).equals(Type.get(Interface)))
            throw new ArgumentTypeException(`type`, Type.of(type));
        if (!Type.of(attributes).equalsOrExtends(Type.get(Number)))
            throw new ArgumentTypeException(`attributes`, Type.of(attributes));
        if (!Type.of(isOptional).equalsOrExtends(Type.get(Boolean)))
            throw new ArgumentTypeException(`isOptional`, Type.of(isOptional));

        let closure = new InterfaceMemberClosure(this, name, type, attributes, isOptional);
        closureMap.set(this, closure);
    }

    get name() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.name;
    }

    get type() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.type;
    }

    get attributes() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.attributes;
    }

    get isOptional() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.isOptional;
    }
}

class InterfaceClosure {
    static *createMembers(descriptorMap) {
        for (let name of Object.getOwnPropertyNames(descriptorMap)) {
            let descriptor = descriptorMap[name];

            let type = descriptor.type === undefined ? null : descriptor.type,
                attributes = descriptor.attributes === undefined ? MemberAttributes.Any : descriptor.attributes,
                isOptional = descriptor.isOptional === undefined ? false : descriptor.isOptional;

            yield new InterfaceMember(name, type, attributes, isOptional);
        }
    }

    constructor(target, map) {
        this.target = target;

        this.members = [...InterfaceClosure.createMembers(map)];
    }
}

export class Interface {
    constructor(map) {
        if (!Type.of(map).equalsOrExtends(Type.get(Object)))
            throw new ArgumentTypeException("map", Type.of(map), Type.get(Object));

        let closure = new InterfaceClosure(this, map);
        closureMap.set(this, closure);
    }

    get members() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.members;
    }
}

export const MemberSelectionAttributes = Enumeration.create({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4,
    Any: 7
});

export const MemberSelectionType = Enumeration.create({
    Property: 1,
    Function: 2,
    Static: 4,
    Any: 7
});

function getTypeEffectiveValue(type) {
    const closure = closureMap.get(type);
    if (!closure) return undefined;

    return closure.getEffectiveValue();
}

export class TypeClosure {
    constructor(target) {
        this.target = target;
    }

    instance = null;
    hasInstance = false;
    _class = null;
    hasClass = false;
    typeofResult = null;
    members = null;
    initialized = false;

    initializeWithInstance(instance) {
        this.instance = instance;
        if (instance !== null && instance !== undefined)
            this.initializeWithClass(instance.constructor);

        this.hasInstance = true;
        this.initialized = true;
    }

    initializeWithClass(_class) {
        if (!(_class instanceof Function))
            throw new ArgumentTypeException("_class");

        this._class = _class;
        this.hasClass = true;
        this.initialized = true;
    }

    checkInitializedStatus() {
        if (this.initialized) return;

        throw new InvalidOperationException("Type not initialized.");
    }

    getName() {
        this.checkInitializedStatus();

        if (!this.hasClass)
            return typeof this.instance;

        return this._class.name;
    }

    * getOwnMembers(selectionType, selectionAttributes) {
        function* createMembers(type, _class, hasClass, instance, hasInstance) {
            if (!hasClass) return;

            const staticDescriptorsDictionary = Dictionary.fromKeyValueObject(Object.getOwnPropertyDescriptors(_class));
            for (let item of staticDescriptorsDictionary)
                yield createMember(type, item.key, item.value, true);

            if (!hasInstance) return;

            const descriptorsDictionary = Dictionary.fromKeyValueObject(Object.getOwnPropertyDescriptors(instance));
            for (let item of descriptorsDictionary)
                yield createMember(type, item.key, item.value, false);
        }

        function* selectMembers(members, selectionType, selectionAttributes) {
            for (let member of members) {
                if ((member instanceof StaticPropertyMember || member instanceof StaticFunctionMember) &&
                    !Enumeration.isSet(selectionType, MemberSelectionType.Static)) continue;

                if (member instanceof PropertyMember && !Enumeration.isSet(selectionType, MemberSelectionType.Property)) continue;

                if (member instanceof FunctionMember && !Enumeration.isSet(selectionType, MemberSelectionType.Function)) continue;

                if (!Enumeration.isSet(member.attributes, selectionAttributes));

                yield member;
            }
        }

        this.checkInitializedStatus();

        if (!this.hasClass) return;

        let members = createMembers(this.target, this._class, this.hasClass, this.instance, this.hasInstance);

        let selectedMembers = selectMembers(members, selectionType, selectionAttributes);

        yield* selectedMembers;
    }

    * getMembers(selectionType, selectionAttributes) {
        function* getAllMembers() {
            yield* this.getOwnMembers(selectionType, selectionAttributes);

            for (let parentType of this.getParentTypes())
                yield* parentType.getOwnMembers(selectionType, selectionAttributes);
        }

        function* hideRereocurringMembers(members) {
            let reocurringMembers = [];

            for (let member of members) {
                if (reocurringMembers.find(m => m.isSame(member)))
                    continue;

                yield member;

                reocurringMembers.push(member);
            }
        }

        let allMembers = getAllMembers.call(this);

        yield* hideRereocurringMembers(allMembers);
    }

    getEffectiveValue() {
        this.checkInitializedStatus();

        if (!this.hasClass)
            return typeof this.instance;

        return this._class;
    }

    equals(other) {
        if (!(other instanceof Type))
            throw new ArgumentTypeException("other");

        return this.getEffectiveValue() === getTypeEffectiveValue(other);
    }

    extends(other) {
        this.checkInitializedStatus();

        for (let type of this.getParentTypes()) {
            if (type.equals(other))
                return true;
        }

        return false;
    }

    equalsOrExtends(other) {
        return this.equals(other) || this.extends(other);
    }

    implements(_interface) {
        function getMemberByName(members, name) {
            return members.find(m => m.name === name);
        }

        function attributesMatch(memberAttributes, interfaceMemberAttributes) {
            return Enumeration.isSet(memberAttributes, interfaceMemberAttributes);
        }

        function membersMatch(member, interfaceMember) {
            if (!member) {
                if (interfaceMember.isOptional)
                    return true;

                return false;
            }

            if (interfaceMember.type instanceof Type) {
                if (!member.type.equalsOrExtends(interfaceMember.type))
                    return false;
            }
            else if (interfaceMember.type instanceof Interface) {
                if (!member.type.implements(interfaceMember.type))
                    return false;
            }

            if (!attributesMatch(member.attributes, interfaceMember.attributes))
                return false;

            return true;
        }

        if (!Type.of(_interface).equalsOrExtends(Type.get(Interface)))
            throw new ArgumentTypeException("interface", Type.of(_interface), Type.get(Interface));

        let members = [...this.getMembers(MemberSelectionType.Property | MemberSelectionType.Function,
            MemberSelectionAttributes.Any)];

        for (let interfaceMember of _interface.members) {
            let member = getMemberByName(members, interfaceMember.name);

            if (!membersMatch(member, interfaceMember))
                return false;
        }

        return true;
    }

    * getParentTypes() {
        function* getParentClasses(_class) {
            while (_class instanceof Function) {
                yield _class;
                _class = Object.getPrototypeOf(_class);
            }
        }

        function* createParentTypes(_class) {
            for (let parentClass of getParentClasses(_class))
                yield Type.get(parentClass);
        }

        if (!this.hasClass)
            return;

        yield* createParentTypes(this._class);
    }

    getParentType() {
        function getParentClass(_class) {
            let parentClass = Object.getPrototypeOf(_class);
            if (parentClass instanceof Function)
                return parentClass;

            return null;
        }

        function createParentType(_class) {
            let parentClass = getParentClass(_class);
            if (parentClass !== null)
                return Type.get(parentClass);

            return null;
        }

        if (!this.hasClass)
            return null;

        return createParentType(this._class);
    }
}

export class Type {
    static get(_class) {
        function createAndInitializeType(_class) {
            let result = new Type();

            let closure = closureMap.get(result);
            if (!closure) return undefined;

            closure.initializeWithClass(_class);

            return result;
        }

        return createAndInitializeType(_class);
    }

    static of(instance) {
        function createAndInitializeType(instance) {
            let result = new Type();

            let closure = closureMap.get(result);
            if (!closure) return undefined;

            if (closure !== undefined && closure !== null)
                closure.initializeWithInstance(instance);

            return result;
        }

        return createAndInitializeType(instance);
    }

    constructor() {
        let closure = new TypeClosure(this);
        closureMap.set(this, closure);
    }

    get name() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.getName();
    }

    getOwnMembers(selectionType = MemberSelectionType.Any, selectionAttributes = MemberSelectionAttributes.Any) {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.getOwnMembers(selectionType, selectionAttributes);
    }

    getMembers(selectionType = MemberSelectionType.Any, selectionAttributes = MemberSelectionAttributes.Any) {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.getMembers(selectionType, selectionAttributes);
    }

    getParentTypes() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.getParentTypes();
    }

    getParentType() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.getParentType();
    }

    implements(_interface) {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.implements(_interface);
    }

    equals(other) {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.equals(other);
    }

    equalsOrExtends(other) {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.equalsOrExtends(other);
    }

    extends(other) {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.extends(other);
    }
}

export const MemberAttributes = Enumeration.create({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4
});

export const MemberType = Enumeration.create({
    Property: 1,
    Function: 2,
    Static: 4
});

function getMemberAttributes(descriptor) {
    return (descriptor.writable ? MemberAttributes.Writable : 0) |
        (descriptor.enumerable ? MemberAttributes.Enumerable : 0) |
        (descriptor.configurable ? MemberAttributes.Configurable : 0);
}

function createMember(parentType, name, descriptor, isStatic) {
    let attributes = getMemberAttributes(descriptor);

    const value = descriptor.value;
    const type = Type.of(value);

    let member = null;
    let memberType = null;

    const isFunction = type.equals(Type.get(Function));
    if (isFunction) {
        if (isStatic) {
            member = new StaticFunctionMember();
            memberType = MemberType.Function | MemberType.Static;
        }
        else {
            member = new FunctionMember();
            memberType = MemberType.Function;
        }
    }
    else {
        if (isStatic) {
            member = new StaticPropertyMember();
            memberType = MemberType.Property | MemberType.Static;
        }
        else {
            member = new PropertyMember();
            memberType = MemberType.Property;
        }
    }

    let closure = {
        parentType,
        type,
        memberType,
        name,
        attributes
    };

    if (member !== null)
        closureMap.set(member, closure);

    return member;
}

function getParentTypeClosure(member) {
    let parentType = this.getType();
    if (!parentType) return undefined;

    let parentTypeClosure = closureMap.get(parentType);
    return parentTypeClosure;
}

export class Member {
    constructor() {
        if (this.constructor === Member)
            throw new InvalidOperationException("Invalid constructor");
    }

    isSame(other) {
        return this.name === other.name && this.memberType === other.memberType;
    }

    get parentType() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.parentType;
    }

    get memberType() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.memberType;
    }

    get type() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.type;
    }

    get name() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.name;
    }

    get attributes() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.attributes;
    }
}

export class PropertyMember extends Member {
    getValue(instance) {
        let name = this.getName();

        return instance[name];
    }

    setValue(instance, value) {
        let name = this.getName();

        instance[name] = value;
    }
}

export class StaticPropertyMember extends PropertyMember {
    getType() {
        let closure = closureMap.get(this);
        if (!closure) return undefined;

        return closure.type;
    }

    getValue() {
        let typeClosure = getParentTypeClosure(this);
        if (!typeClosure) return undefined;

        super.getValue(typeClosure.constructor);
    }

    setValue(value) {
        let typeClosure = getParentTypeClosure(this);
        if (!typeClosure) return;

        super.getValue(typeClosure.constructor, value);
    }
}

export class FunctionMember extends Member {
    invoke(instance, ...args) {
        let name = this.getName();

        instance[name].call(instance, ...args);
    }
}

export class StaticFunctionMember extends FunctionMember {
    invoke(instance) {
        let typeClosure = getParentTypeClosure(this);
        if (!typeClosure) return;

        super.invoke(typeClosure.constructor);
    }
}

window.Interface = Interface;
window.Type = Type;