import { Enumeration, Dictionary } from "./standard.js";
import { InvalidOperationException } from "./exceptions.js";

function* getAllMembers(type) {
    let metadata = metadataMap.get(type);
    if (!metadata) return;

    let constructor = metadata.constructor;
    if (!constructor) return;

    const staticDescriptorsDictionary = Dictionary.fromKeyValueObject(Object.getOwnPropertyDescriptors(constructor));

    for (let item of staticDescriptorsDictionary)
        createMember(type, item.key, item.value, true);

    let referenceInstance = metadata.referenceInstance;
    if (!referenceInstance) return;

    const descriptorsDictionary = Dictionary.fromKeyValueObject(Object.getOwnPropertyDescriptors(referenceInstance));

    for (let item of descriptorsDictionary)
        createMember(type, item.key, item.value, false);
}

function* filterMembers(members, selectionType, selectionAttributes) {
    for (let member of members) {
        if (member.type & ~selectionType != 0) continue;

        if (member.attributes & ~selectionAttributes != 0) continue;

        yield member;
    }
}

export const MemberSelectionAttributes = Enumeration.create({
    Any: 0,
    Configurable: 1,
    Enumerable: 2,
    Writable: 4
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
        classConstructor: constructor
    }

    metadataMap.set(type, metadata);

    return type;
}

function createTypeFromInstance(obj) {
    let type = new Type();

    const hasConstructor = obj !== null && obj !== undefined;

    let metadata = {
        classConstructor: hasConstructor ? obj.constructor : null,
        referenceInstance: hasConstructor ? obj : null,
        typeOfResult: typeof obj
    };
    metadataMap.set(type, metadata);

    return type;
}

function getTypeConstructor(type) {
    const metadata = metadataMap.get(this);
    if (!metadata) return null;

    return metadata.classConstructor;
}

function getTypeMembers(type) {

}

export class Type {
    static of(obj) { return createTypeFromConstructor(constructor); }

    static get(constructor) { return createTypeFromInstance(obj); }

    equals(other) {
        let constructor = getTypeConstructor(this),
            otherConstructor = getTypeConstructor(other);

        if (!!constructor ^ !!otherConstructor) return false;

        if (!!constructor)
            return constructor === otherConstructor;

        return metadata.typeofResult === otherMetadata.typeofResult;
    }

    get name() {
        let constructor = getTypeConstructor(this);
        if (!constructor) return metadata.typeofResult;

        return constructor.name;
    }

    getMembers(selectionFlags = MemberSelectionFlags.Any, selectionAttributes = MemberSelectionAttributes.Any) {
        return filterMembers(getAllMembers(this), selectionFlags, selectionAttributes);
    }

    getParentType() {
        const constructor = getTypeConstructor();
        if (!classConstructor) return null;

        const prototype = constructor.prototype;
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

const MemberType = Enumeration.create({
    Property: 1,
    Function: 2,
    Static: 4
});

function getMemberType(descriptor, isStatic) {
    let value = descriptor.value,
        memberType = isStatic ? MemberType.Static : 0;

    if (value instanceof Function)
        memberType |= MemberType.Function;
    else
        memberType |= MemberType.Property;

    return memberType;
}

function getMemberAttributes(descriptor) {
    return (descriptor.writable ? MemberAttributes.Writable : 0) |
        (descriptor.enumerable ? MemberAttributes.Enumerable : 0) |
        (descriptor.configurable ? MemberAttributes.Configurable : 0);
}

function createMember(type, name, descriptor, isStatic) {
    let memberType = getMemberType(descriptor, isStatic),
        attributes = getMemberAttributes(descriptor);

    let metadata = {
        type,
        name,
        attributes,
        memberType
    };

    let member = null;

    if (Enumeration.isSet(memberType, MemberType.Property)) {
        if (Enumeration.isSet(memberType, MemberType.Static))
            member = new StaticPropertyMember();
        else
            member = new PropertyMember();
    }
    else if (Enumeration.isSet(memberType, MemberType.Function)) {
        if (Enumeration.isSet(memberType, MemberType.Static))
            member = new StaticFunctionMember();
        else
            member = new FunctionMember();
    }

    if (member !== null)
        metadataMap.set(metadata);

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

        super.getValue(typeMetadata.classConstructor);
    }

    setValue(value) {
        let typeMetadata = getParentTypeMetadata(this);
        if (!typeMetadata) return;

        super.getValue(typeMetadata.classConstructor, value);
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

        super.invoke(typeMetadata.classConstructor);
    }
}

window.Type = Type;