import { Dictionary } from "./Standard.Collections.js";
import { Enumeration } from "./Standard.Enumeration.js";

function* getAllMembers(type) {
    let metadata = metadataMap.get(type);
    if (!metadata) return;

    let constructor = getTypeConstructor(type);
    if (constructor === undefined) return;

    const staticDescriptorsDictionary = Dictionary.fromKeyValueObject(Object.getOwnPropertyDescriptors(constructor));

    for (let item of staticDescriptorsDictionary)
        yield createMember(type, item.key, item.value, true);

    let reference = getTypeReference(type);
    if (reference === undefined) return;

    const descriptorsDictionary = Dictionary.fromKeyValueObject(Object.getOwnPropertyDescriptors(reference));

    for (let item of descriptorsDictionary)
        yield createMember(type, item.key, item.value, false);
}

function* filterMembers(members, selectionType, selectionAttributes) {
    for (let member of members) {
        if ((member instanceof StaticPropertyMember || member instanceof StaticFunctionMember) &&
            !Enumeration.isSet(selectionType, MemberSelectionType.Static)) continue;

        if (member instanceof PropertyMember && !Enumeration.isSet(selectionType, MemberSelectionType.Property)) continue;

        if (member instanceof FunctionMember && !Enumeration.isSet(selectionType, MemberSelectionType.Function)) continue;

        if (!Enumeration.contains(member.attributes, selectionAttributes));

        yield member;
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

let metadataMap = new WeakMap();

function createTypeFromConstructor(constructor) {
    let type = new Type();

    let metadata = {
        constructor: constructor
    };

    metadataMap.set(type, metadata);

    return type;
}

function createTypeFromInstance(obj) {
    let type = new Type();

    let metadata = {
        typeOfResult: typeof obj
    };

    const hasConstructor = obj !== null && obj !== undefined;
    if (hasConstructor) {
        metadata.constructor = obj.constructor;
        metadata.reference = obj;
    }

    metadataMap.set(type, metadata);

    return type;
}

function getTypeConstructor(type) {
    const metadata = metadataMap.get(type);
    if (!metadata) return undefined;

    return metadata.constructor;
}

function getTypeTypeofResult(type) {
    const metadata = metadataMap.get(type);
    if (!metadata) return undefined;

    return metadata.typeOfResult;
}

function getTypeReference(type) {
    const metadata = metadataMap.get(type);
    if (!metadata) return undefined;

    return metadata.reference;
}

export class Type {
    static get(constructor) { return createTypeFromConstructor(constructor); }

    static of(obj) { return createTypeFromInstance(obj); }

    equals(other) {
        let constructor = getTypeConstructor(this),
            otherConstructor = getTypeConstructor(other);

        if (!!constructor ^ !!otherConstructor) return false;

        if (constructor)
            return constructor === otherConstructor;

        return metadata.typeofResult === otherMetadata.typeofResult;
    }

    equalsAny(...others) {
        for (let other of others) {
            if (this.equals(other))
                return true;
        }

        return false;
    }

    extends(other) {
        for (let type of this.getParentTypes()) {
            if (type.equals(other))
                return true;
        }

        return false;
    }

    extendsAny(...others) {
        for (let other of others) {
            if (this.extends(other))
                return true;
        }

        return false;
    }

    get name() {
        let constructor = getTypeConstructor(this);
        if (constructor) return constructor.name;

        let typeofResult = getTypeofResult(this);
        if (typeofResult) return String(typeofResult);

        return null;
    }

    getMembers(selectionFlags = MemberSelectionType.Any, selectionAttributes = MemberSelectionAttributes.Any) {
        return filterMembers(getAllMembers(this), selectionFlags, selectionAttributes);
    }

    getParentType() {
        const constructor = getTypeConstructor(this);
        if (!constructor) return null;

        const prototype = Object.getPrototypeOf(constructor);
        if (!prototype) return null;

        return Type.get(prototype);
    }

    *getParentTypes() {
        let parentType = this.getParentType();

        while (parentType) {
            yield parentType;

            parentType = parentType.getParentType();
        }
    }
}

export const MemberAttributes = Enumeration.create({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4
});

function getMemberAttributes(descriptor) {
    return (descriptor.writable ? MemberAttributes.Writable : 0) |
        (descriptor.enumerable ? MemberAttributes.Enumerable : 0) |
        (descriptor.configurable ? MemberAttributes.Configurable : 0);
}

function createMember(type, name, descriptor, isStatic) {
    let attributes = getMemberAttributes(descriptor);

    let metadata = {
        type,
        name,
        attributes
    };

    let member = null;

    const isFunction = descriptor.value instanceof Function;
    if (isFunction) {
        if (isStatic)
            member = new StaticFunctionMember();
        else
            member = new FunctionMember();
    }
    else {
        if (isStatic)
            member = new StaticPropertyMember();
        else
            member = new PropertyMember();
    }

    if (member !== null)
        metadataMap.set(member, metadata);

    return member;
}

function getParentTypeMetadata(member) {
    let parentType = this.getType();
    if (!parentType) return undefined;

    let parentTypeMetadata = metadataMap.get(parentType);
    return parentTypeMetadata;
}

export class Member {
    get type() {
        let metadata = metadataMap.get(this);
        if (!metadata) return undefined;

        return metadata.type;
    }

    get name() {
        let metadata = metadataMap.get(this);
        if (!metadata) return undefined;

        return metadata.name;
    }

    get attributes() {
        let metadata = metadataMap.get(this);
        if (!metadata) return undefined;

        return metadata.attributes;
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
        let metadata = metadataMap.get(this);
        if (!metadata) return undefined;

        return metadata.type;
    }

    getValue() {
        let typeMetadata = getParentTypeMetadata(this);
        if (!typeMetadata) return undefined;

        super.getValue(typeMetadata.constructor);
    }

    setValue(value) {
        let typeMetadata = getParentTypeMetadata(this);
        if (!typeMetadata) return;

        super.getValue(typeMetadata.constructor, value);
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
        let typeMetadata = getParentTypeMetadata(this);
        if (!typeMetadata) return;

        super.invoke(typeMetadata.constructor);
    }
}

window.Type = Type;