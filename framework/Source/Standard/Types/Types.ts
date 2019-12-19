import { Enumeration } from "../Enumeration";
import { InvalidOperationException, ArgumentTypeException } from "../Exceptions";

export const InterfaceDifferenceKind = new Enumeration([
    "MissingProperty",
    "IncorrectType"
]);

export class InterfaceDifference {
    constructor(analizedType: Type, analizedInterface: Interface, propertyName: string, differenceType: number) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__propertyName = propertyName;
        this.__differenceType = differenceType;
    }

    get analizedType(): Type { return this.__analizedType; }
    private __analizedType: Type;

    get analizedInterface(): Interface { return this.__analizedInterface; }
    private __analizedInterface: Interface;

    get propertyName(): string | symbol { return this.__propertyName; }
    private __propertyName: string;

    get differenceType(): number { return this.__differenceType; }
    private __differenceType: number;
}

export class InterfaceDifferAnalysis {
    constructor(analizedType: Type, analizedInterface: Interface, ...differences: InterfaceDifference[]) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__differences = differences;
    }

    get analizedType() { return this.__analizedType; }
    private __analizedType: Type;

    get analizedInterface() { return this.__analizedInterface; }
    private __analizedInterface: Interface;

    get differences() { return this.__differences; }
    private __differences: InterfaceDifference[];
}

export const InterfaceMemberType = new Enumeration([
    "Property",
    "Function"
]);

export class InterfaceMember {
    constructor(name: string, memberType: number = MemberSelectionType.Any, attributes: number = MemberSelectionAttributes.Any, isOptional = false, valueType?: Type) {
        if (new.target === InterfaceMember)
            throw new InvalidOperationException("Invalid constructor.");

        if (typeof name !== "string")
            throw new ArgumentTypeException(`name`, Type.of(name));
        if (typeof memberType !== "number")
            throw new ArgumentTypeException(`memberType`, Type.of(memberType));
        if (valueType !== null && !(valueType instanceof Type))
            throw new ArgumentTypeException(`valueType`, Type.of(valueType));
        if (typeof attributes !== "number")
            throw new ArgumentTypeException(`attributes`, Type.of(attributes));
        if (typeof isOptional !== "boolean")
            throw new ArgumentTypeException(`isOptional`, Type.of(isOptional));

        this.__name = name;
        this.__memberType = memberType;
        this.__valueType = valueType;
        this.__attributes = attributes;
        this.__isOptional = isOptional;
    }

    get name() { return this.__name; }
    private __name: string | symbol;

    get memberType(): number { return this.__memberType; }
    private __memberType: number;

    get valueType(): Type { return this.__valueType; }
    private __valueType: Type;

    get attributes(): number { return this.__attributes; }
    private __attributes: number;

    get isOptional(): boolean { return this.__isOptional; }
    private __isOptional: boolean;
}

export class InterfaceProperty extends InterfaceMember {
    constructor(name, type = null, attributes = MemberSelectionAttributes.Any, isOptional = false) {
        super(name, InterfaceMemberType.Property, type, attributes, isOptional);
    }

    get type() {
        return Closure.doIfExists(this, c => c.type);
    }
}

export class InterfaceFunction extends InterfaceMember {
    constructor(name, attributes = MemberSelectionAttributes.Any, isOptional = false) {
        super(name, InterfaceMemberType.Function, null, attributes, isOptional);
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
    static getInstanceHasConstructor(instance) {
        if (instance === undefined)
            return false;
        if (instance === null)
            return false;

        return true;
    }

    static createTypeFromClass(_class) {
        let result = new Type();

        Closure.doIfExists(result, c => {
            c.initializeWithClass(_class);
        });

        return result;
    }

    static createTypeFromInstance(instance) {
        let result = new Type();

        Closure.doIfExists(result, c => {
            c.initializeWithInstance(instance);
        });

        return result;
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

        let instanceHasConstructor = TypeClosure.getInstanceHasConstructor(instance);
        if (instanceHasConstructor)
            this.initializeWithClass(instance.constructor);

        this.hasInstance = true;
        this.initialized = true;
    }

    initializeWithClass(_class) {
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
            return String(this.instance);

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
        yield* this.getOwnMembers(selectionType, selectionAttributes);

        for (let parentType of this.getParentTypes())
            yield* parentType.getOwnMembers(selectionType, selectionAttributes);
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

    * _getParentClasses(_class) {
        let parentClass = this._getParentClass(this._class);

        while (parentClass !== null) {
            yield parentClass;
            parentClass = this._getParentClass(parentClass);
        }
    }

    * getParentTypes() {
        let parentType = this.getParentType();
        if (parentType === null)
            return;

        yield parentType;
        yield* parentType.getParentTypes();
    }

    _getParentInstance(instance) {
        let parentInstance = Object.getPrototypeOf(instance);
        return parentInstance;
    }

    _getParentClass(_class) {
        let parentClass = Object.getPrototypeOf(_class);
        if (parentClass instanceof Function)
            return parentClass;

        return null;
    }

    getParentType() {
        if (this.hasClass) {
            if (this.hasInstance) {
                let parentInstance = this._getParentInstance(this.instance);
                if (parentInstance !== null)
                    return Type.of(parentInstance);
            }
            else {
                let parentClass = this._getParentClass(this._class);
                if (parentClass !== null)
                    return Type.get(parentClass);
            }
        }

        return null;
    }
}

export class Type extends Shell {
    static get(_class) {
        if (!(_class instanceof Function))
            throw new ArgumentTypeException("_class");

        return TypeClosure.createTypeFromClass(_class);
    }

    static of(instance) {
        return TypeClosure.createTypeFromInstance(instance);
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