import { Dictionary } from "./Standard.Collections.js";
import { Enumeration } from "./Standard.Enumeration.js";
import { ArgumentTypeException, InvalidOperationException } from "./exceptions.js";
import { Closure, Shell } from "./Standard.Closures.js";

export const InterfaceDifferenceType = new Enumeration([
    "MissingProperty",
    "IncorrectType"
]);

class InterfaceDifferenceClosure extends Closure {
    checkInitializedStatus() {
        if (!this.initialized)
            throw new InvalidOperationException("InterfaceDifferingAnalysis not initialized.");
    }

    initialize(analizedType, analizedInterface, propertyName, differenceType) {
        this.analizedType = analizedType;
        this.analizedInterface = analizedInterface;
        this.propertyName = propertyName;
    }
}

export class InterfaceDifference extends Shell {
    constructor(analizedType, analizedInterface, propertyName) {
        super(InterfaceDifferenceClosure, analizedType, analizedInterface, propertyName);
    }

    get analizedType() {
        return Closure.doIfExists(this, c => c.analizedType);
    }

    get analizedInterface() {
        return Closure.doIfExists(this, c => c.analizedInterface);
    }
}

export class InterfaceDifferAnalysisClosure extends Closure {
    static createFromTypeAndInterface() {

    }

    initialize(analizedType, ...differences) {
        this.analizedType = analizedType;
        this.differences = differences;
    }

    getIsEmpty() {
        this.checkInitializedStatus();

        return this.differences.length === 0;
    }

    analizedType = null;
    differences = null;
}

export class InterfaceDifferAnalysis extends Shell {
    constructor() {
        super(InterfaceDifferAnalysisClosure);
    }

    get analizedType() {
        return Closure.doIfExists(this, c => c.analizedType);
    }

    get analizedInterface() {
        return Closure.doIfExists(this, c => c.analizedInterface);
    }

    get differences() {
        return Closure.doIfExists(this, c => c.differences);
    }
}

class InterfaceMemberClosure extends Closure {
    initialize(name, type, attributes, isOptional) {
        this.name = name;
        this.type = type;
        this.attributes = attributes;
        this.isOptional = isOptional;
    }

    name = null;
    type = null;
    attributes = null;
    isOptional = null;
}

export class InterfaceMember extends Shell {
    constructor(name, memberType, type, attributes, isOptional) {
        if (!Type.of(name).equals(Type.get(String)))
            throw new ArgumentTypeException(`name`, Type.of(name));
        if (type !== null && !Type.of(type).equals(Type.get(Type)) && !Type.of(type).equals(Type.get(Interface)))
            throw new ArgumentTypeException(`type`, Type.of(type));
        if (!Type.of(attributes).equalsOrExtends(Type.get(Number)))
            throw new ArgumentTypeException(`attributes`, Type.of(attributes));
        if (!Type.of(isOptional).equalsOrExtends(Type.get(Boolean)))
            throw new ArgumentTypeException(`isOptional`, Type.of(isOptional));

        super(InterfaceMemberClosure, type, memberType, attributes, isOptional);

        if (this.constructor === InterfaceMember)
            throw new InvalidOperationException("Invalid constructor.");
    }

    get name() {
        return Closure.doIfExists(this, c => c.name);
    }

    get attributes() {
        return Closure.doIfExists(this, c => c.attributes);
    }

    get isOptional() {
        return Closure.doIfExists(this, c => c.isOptional);
    }
}

export class InterfaceProperty extends InterfaceMember {
    constructor(name, type = null, attributes = MemberSelectionAttributes.Any, isOptional = false) {
        super(name, MemberType.Property, type, attributes, isOptional);
    }

    get type() {
        return Closure.doIfExists(this, c => c.type);
    }
}

export class InterfaceFunction extends InterfaceMember {
    constructor(name, attributes = MemberSelectionAttributes.Any, isOptional = false) {
        super(name, MemberType.Function, null, attributes, isOptional);
    }
}

export class InterfaceFunctionArgumentClosure extends Closure {
    initialize(name, argumentType, isOptional) {

    }
}

export const InterfaceFunctionArgumentType = new Enumeration({

});

export class InterfaceFunctionArgument extends Shell {
    constructor(name, argumentType = ArgumentType.Any, isOptional = false) {

    }
}

class InterfaceClosure extends Closure {
    static extractFromType(type) {
        function* createMembersFromType() {
            const nonStaticMembers = type.getMembers(MemberSelectionType.Any & ~MemberSelectionType.Static);

            for (let member of nonStaticMembers) {
                const type = getMemberType(member);

                yield new InterfaceMember(member.name, type, member.attributes);
            }
        }

        return new Interface(...createMembersFromType());
    }

    initialize(...members) {
        this.members = members;
    }

    members = null;
}

export class Interface extends Shell {
    static extract(type) {
        if (!type instanceof Type)
            throw ArgumentTypeException("type");

        return InterfaceClosure.extractFromType(type);
    }

    constructor(descriptorMap) {
        super(InterfaceClosure, descriptorMap);
    }

    get members() {
        return Closure.doIfExists(this, c => c.members);
    }
}

export const MemberSelectionAttributes = new Enumeration({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4,
    Any: 7
});

export const MemberSelectionType = new Enumeration({
    Property: 1,
    Function: 2,
    Static: 4,
    Any: 3,
    AnyStatic: 7
});

export class TypeClosure extends Closure {
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
        function* createMembers(_class, hasClass, instance, hasInstance) {
            if (!hasClass) return;

            const staticDescriptorsDictionary = Dictionary.fromKeyValueObject(Object.getOwnPropertyDescriptors(_class));
            for (let item of staticDescriptorsDictionary)
                yield MemberClosure.createFromPropertyDescriptor(this.shell, item.key, item.value, true);

            if (!hasInstance) return;

            const descriptorsDictionary = Dictionary.fromKeyValueObject(Object.getOwnPropertyDescriptors(instance));
            for (let item of descriptorsDictionary)
                yield MemberClosure.createFromPropertyDescriptor(this.shell, item.key, item.value, false);
        }

        function* selectMembers(members, selectionType, selectionAttributes) {
            function memberTypeMatches(memberType) {
                if (Enumeration.isFlagSet(MemberSelectionType.Static, selectionType) ^ Enumeration.isFlagSet(MemberType.Static, memberType)) return false;

                if (!Enumeration.contains(Enumeration.intersect(~MemberType.Static, memberType), selectionType)) return false;

                return true;
            }

            function memberAttributesMatch(memberAttributes) {
                return Enumeration.contains(memberAttributes, selectionAttributes);
            }

            for (let member of members) {
                if (!memberTypeMatches(member.memberType)) continue;

                if (!memberAttributesMatch(member.attributes)) continue;

                yield member;
            }
        }

        this.checkInitializedStatus();

        if (!this.hasClass) return;

        let members = createMembers.call(this, this._class, this.hasClass, this.instance, this.hasInstance);

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
            return this.instance;

        return this._class;
    }

    equals(other) {
        if (!(other instanceof Type))
            throw new ArgumentTypeException("other");

        return this.getEffectiveValue() === Closure.doIfExists(other, c => c.getEffectiveValue(other));
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
            return Enumeration.isFlagSet(interfaceMemberAttributes, memberAttributes);
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
        let parentType = this.getParentType();
        if (parentType === null) return;

        yield parentType;
        yield* parentType.getParentTypes();
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

export class Type extends Shell {
    static get(_class) {
        function createAndInitializeType(_class) {
            let result = new Type();

            Closure.doIfExists(result, c => c.initializeWithClass(_class));

            return result;
        }

        return createAndInitializeType(_class);
    }

    static of(instance) {
        function createAndInitializeType(instance) {
            let result = new Type();

            Closure.doIfExists(result, c => c.initializeWithInstance(instance));

            return result;
        }

        return createAndInitializeType(instance);
    }

    constructor() {
        super(TypeClosure);
    }

    get name() {
        return Closure.doIfExists(this, c => c.getName());
    }

    getOwnMembers(selectionType = MemberSelectionType.Any, selectionAttributes = MemberSelectionAttributes.Any) {
        return Closure.doIfExists(this, c => c.getOwnMembers(selectionType, selectionAttributes));
    }

    getMembers(selectionType = MemberSelectionType.Any, selectionAttributes = MemberSelectionAttributes.Any) {
        return Closure.doIfExists(this, c => c.getMembers(selectionType, selectionAttributes));
    }

    getParentTypes() {
        return Closure.doIfExists(this, c => c.getParentTypes());
    }

    getParentType() {
        return Closure.doIfExists(this, c => c.getParentType());
    }

    implements(_interface) {
        return Closure.doIfExists(this, c => c.implements(_interface));
    }

    equals(other) {
        return Closure.doIfExists(this, c => c.equals(other));
    }

    equalsOrExtends(other) {
        return Closure.doIfExists(this, c => c.equalsOrExtends(other));
    }

    extends(other) {
        return Closure.doIfExists(this, c => c.extends(other));
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
    Static: 4
});

class MemberClosure extends Closure {
    static createFromPropertyDescriptor(parentType, name, descriptor, isStatic) {
        function getAttributesFromDescriptor(descriptor) {
            return (descriptor.writable ? MemberAttributes.Writable : 0) |
                (descriptor.enumerable ? MemberAttributes.Enumerable : 0) |
                (descriptor.configurable ? MemberAttributes.Configurable : 0);
        }

        let attributes = getAttributesFromDescriptor(descriptor);

        const value = descriptor.value;
        const type = Type.of(value);

        const isFunction = type.equals(Type.get(Function));
        if (isFunction) {
            if (isStatic)
                return new StaticFunctionMember(name, type, parentType, attributes);
            else
                return new FunctionMember(name, type, parentType, attributes);
        }
        else {
            if (isStatic)
                return new StaticPropertyMember(name, type, parentType, attributes);
            else
                return new PropertyMember(name, type, parentType, attributes);
        }
    }

    initialize(parentType, type, memberType, name, attributes) {
        this.parentType = parentType;
        this.type = type;
        this.memberType = memberType;
        this.name = name;
        this.attributes = attributes;
    }

    getInvokable() {
        function* getArgumentStrings(_arguments) {
            for (let argument of _arguments)
                yield argument.toString();
        }

        if (this.body !== null)
            return new Function(...getArgumentStrings(this._arguments), this.body);

        return null;
    }

    isSame(other) {
        if (this.name !== other.name) return false;

        if (this.memberType !== other.memberType) return false;

        if (this.memberType === MemberType.Property && this.type !== other.type) return false;

        return true;
    }

    getValue(instance) {
        return instance[this.name];
    }

    setValue(instance, value) {
        instance[this.name] = value;
    }

    invoke(instance, ...args) {
        let value = this.getValue(instance);

        return value.call(instance, ...args);
    }

    getValueStatic() {
        let _class = Closure.doIfExists(this.parentType, c => c._class);
        if (!_class) return undefined;

        return this.getValue(_class);
    }

    setValueStatic(value) {
        let _class = Closure.doIfExists(this.parentType, c => c._class);
        if (!_class) return;

        this.setValue(_class, value);
    }

    invokeStatic(...args) {
        let _class = Closure.doIfExists(this.parentType, c => c._class);
        if (!_class) return;

        return this.invoke(_class, ...args);
    }
}

export class Member extends Shell {
    constructor(name, type, parentType, memberType, attributes) {
        super(MemberClosure, parentType, type, memberType, name, attributes);

        if (this.constructor === Member)
            throw new InvalidOperationException("Invalid constructor");
    }

    isSame(other) {
        return Closure.doIfExists(this, c => c.isSame(other));
    }

    get parentType() {
        return Closure.doIfExists(this, c => c.parentType);
    }

    get memberType() {
        return Closure.doIfExists(this, c => c.memberType);
    }

    get name() {
        return Closure.doIfExists(this, c => c.name);
    }

    get attributes() {
        return Closure.doIfExists(this, c => c.attributes);
    }
}

export class PropertyMember extends Member {
    constructor(name, type, parentType, attributes) {
        super(name, type, parentType, MemberType.Property, attributes);
    }

    get type() {
        return Closure.doIfExists(this, c => c.type);
    }

    getValue(instance) {
        return Closure.doIfExists(this, c => c.getValue(instance));
    }

    setValue(instance, value) {
        return Closure.doIfExists(this, c => c.setValue(instance, value));
    }
}

export class StaticPropertyMember extends Member {
    constructor(name, type, parentType, attributes) {
        super(name, type, parentType, MemberType.Property | MemberType.Static, attributes);
    }

    get type() {
        return Closure.doIfExists(this, c => c.type);
    }

    getValue(instance) {
        return Closure.doIfExists(this, c => c.getValueStatic(instance));
    }

    setValue(instance, value) {
        return Closure.doIfExists(this, c => c.setValueStatic(instance, value));
    }
}

export class FunctionMember extends Member {
    static parse(value) {
        return MemberClosure.parseFunctionMember(value);
    }

    constructor(name, type, parentType, attributes) {
        super(name, type, parentType, MemberType.Function, attributes);
    }

    invoke(instance, ...args) {
        return Closure.doIfExists(this, c => c.invoke(instance, ...args));
    }
}

export class StaticFunctionMember extends Member {
    constructor(name, type, parentType, attributes) {
        super(name, type, parentType, MemberType.Function | MemberType.Static, attributes);
    }

    invoke(...args) {
        return Closure.doIfExists(this, c => c.invokeStatic(...args));
    }
}