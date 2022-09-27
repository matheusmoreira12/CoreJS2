import { OutputArgument } from "../reflection/types.js";
import { DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "./index.js";
import { Type } from "../reflection/index.js";
import { Guid } from "../guids/guid.js";

export namespace __Registry {
    interface RegisteredPropertyInfo {
        id: Guid,
        property: DependencyProperty,
        name: string,
        targetType: Type,
        keyId: Guid | null,
        key: DependencyPropertyKey | null,
        metadata: PropertyMetadata,
        isAttached: boolean,
        isReadonly: boolean
    }

    namespace RegisteredPropertyInfo {
        export function create(id: Guid, property: DependencyProperty, name: string, targetType: Type, metadata: PropertyMetadata, isAttached: boolean = false, isReadonly: boolean = false, keyId: Guid | null = null, key: DependencyPropertyKey | null): RegisteredPropertyInfo {
            return {
                id,
                property,
                name,
                targetType,
                keyId,
                key,
                metadata,
                isAttached,
                isReadonly
            };
        }
    }

    const registered: RegisteredPropertyInfo[] = [];
    console.log(registered);

    export function tryRegisterAttached(targetType: Type, property: DependencyProperty, name: string, metadata: PropertyMetadata): boolean {
        const outInfo = {};
        if (tryGetInfo(property, outInfo))
            return false;

        addRegisteredProperty(targetType, property, name, metadata, true, false, null);
        return true;
    }

    export function tryRegisterReadonly(targetType: Type, property: DependencyProperty, name: string, key: DependencyPropertyKey, metadata: PropertyMetadata) {
        const outInfo = {};
        if (tryGetInfo(property, outInfo))
            return false;
        if (tryGetInfoByKey(key, outInfo))
            return false;

        addRegisteredProperty(targetType, property, name, metadata, true, true, key);
        return true;
    }

    export function tryRegister(targetType: Type, property: DependencyProperty, name: string, metadata: PropertyMetadata) {
        const outInfo = {};
        if (tryGetInfo(property, outInfo))
            return false;

        addRegisteredProperty(targetType, property, name, metadata, false, false, null);
        return true;
    }

    function addRegisteredProperty(targetType: Type, property: DependencyProperty, name: string, metadata: PropertyMetadata, isAttached: boolean, isReadonly: boolean, key: DependencyPropertyKey | null): void {
        const id = Guid.createUnique();
        property.__id = id;
        let keyId: Guid | null = null;
        if (isReadonly) {
            keyId = Guid.createUnique();
            key!.__id = keyId;
        }
        const info = RegisteredPropertyInfo.create(id, property, name, targetType, metadata, isAttached, isReadonly, keyId, key);
        registered.push(info);
    }

    export function tryGetMetadata(property: DependencyProperty, outMetadata: OutputArgument<PropertyMetadata>): boolean {
        const outInfo: OutputArgument<RegisteredPropertyInfo> = {};
        if (!tryGetInfo(property, outInfo))
            return false;
        outMetadata.value = outInfo.value!.metadata;
        return true;
    }

    export function tryGetName(property: DependencyProperty, outName: OutputArgument<string>): boolean {
        const outInfo: OutputArgument<RegisteredPropertyInfo> = {};
        if (!tryGetInfo(property, outInfo))
            return false;
        outName.value = outInfo.value!.name;
        return true;
    }

    export function tryGetIsReadonly(property: DependencyProperty, outIsReadonly: OutputArgument<boolean>): boolean {
        const outInfo: OutputArgument<RegisteredPropertyInfo> = {};
        if (!tryGetInfo(property, outInfo))
            return false;
        outIsReadonly.value = outInfo.value!.isReadonly;
        return true;
    }

    function tryGetInfo(property: DependencyProperty, outInfo: OutputArgument<RegisteredPropertyInfo>): boolean {
        const info = registered.find(i => i.id.equals(property.id));
        if (info === undefined)
            return false;
        outInfo.value = info;
        return true;
    }

    export function tryGetByKey(key: DependencyPropertyKey, outProperty: OutputArgument<DependencyProperty>): boolean {
        const outInfo: OutputArgument<RegisteredPropertyInfo> = {};
        if (!tryGetInfoByKey(key, outInfo))
            return false;
        outProperty.value = outInfo.value!.property;
        return true;
    }

    function tryGetInfoByKey(key: DependencyPropertyKey, outInfo: OutputArgument<RegisteredPropertyInfo>): boolean {
        const info = registered.find(i => i.keyId?.equals(key.id));
        if (info === undefined)
            return false;
        outInfo.value = info;
        return true;
    }

    export function getAll(targetType: Type): DependencyProperty[] {
        return registered.filter(i => targetType.extends(i.targetType)).map(i => i.property);
    }
}