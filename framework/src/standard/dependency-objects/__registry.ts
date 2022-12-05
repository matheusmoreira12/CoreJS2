import { OutputArgument } from "../reflection/types.js";
import { DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "./index.js";
import { Type } from "../reflection/index.js";
import { Guid } from "../guids/guid.js";

export namespace __Registry {
    interface RegistryData {
        id: Guid;
        isDependencyProperty: boolean;
        isDependencyPropertyKey: boolean;
    }

    namespace RegistryData {
        export function tryGet(id: Guid, outData: OutputArgument<RegistryData>) {
            const data = registeredData.find(d => d.id.equals(id));
            if (!data)
                return false;
            outData.value = data;
            return true;
        }
    }

    interface DependencyPropertyData extends RegistryData {
        isDependencyProperty: true;
        name: string;
        targetType: Type;
        metadata: PropertyMetadata;
        isAttached: boolean;
        isReadonly: boolean;
    }

    namespace DependencyPropertyData {
        export function create(name: string, targetType: Type, metadata: PropertyMetadata, isAttached: boolean = false, isReadonly: boolean = false): DependencyPropertyData {
            return {
                isDependencyProperty: true,
                isDependencyPropertyKey: false,
                id: Guid.create(),
                name,
                targetType,
                metadata,
                isAttached,
                isReadonly,
            };
        }

        export function tryRegister(prop: DependencyProperty, data: DependencyPropertyData): boolean {
            const isAlreadyRegistered = registeredData.some(d => d.isDependencyProperty && nameMatches(d as DependencyPropertyData) && attachmentMatches(d as DependencyPropertyData) && targetTypeMatches(d as DependencyPropertyData));
            if (isAlreadyRegistered)
                return false;
            prop.__id = data.id;
            registeredData.push(data);
            return true;

            function nameMatches(p: DependencyPropertyData) {
                return p.name == data.name;
            }

            function attachmentMatches(p: DependencyPropertyData) {
                return p.isAttached == data.isAttached;
            }

            function targetTypeMatches(p: DependencyPropertyData) {
                return p.targetType.equals(data.targetType);
            }
        }

        export function tryGetIdByKeyId(keyId: Guid, outId: OutputArgument<Guid>) {
            const outKeyData: OutputArgument<DependencyPropertyKeyData> = {};
            if (!RegistryData.tryGet(keyId, outKeyData))
                return false;
            const keyData = outKeyData.value!;
            outId.value = keyData.propertyId;
            return true;
        }

        export function getAllPropIdsForTargetType(targetType: Type) {
            return registeredData.filter(d => d.isDependencyProperty && targetTypeMatches(d as DependencyPropertyData)).map(d => d.id);

            function targetTypeMatches(p: DependencyPropertyData) {
                return p.targetType.equals(targetType) || targetType.extends(p.targetType);
            }
        }
    }

    interface DependencyPropertyKeyData extends RegistryData {
        isDependencyPropertyKey: true;
        propertyId: Guid;
    }

    namespace DependencyPropertyKeyData {
        export function create(propertyId: Guid): DependencyPropertyKeyData {
            return {
                isDependencyProperty: false,
                isDependencyPropertyKey: true,
                id: Guid.create(),
                propertyId,
            };
        }

        export function tryRegister(propKey: DependencyPropertyKey, data: DependencyPropertyKeyData): boolean {
            const isAlreadyRegistered = registeredData.some(d => d.isDependencyPropertyKey && propIdMatches(d as DependencyPropertyKeyData));
            if (isAlreadyRegistered)
                return false;
            propKey.__id = data.id;
            registeredData.push(data);
            return true;

            function propIdMatches(k: DependencyPropertyKeyData) {
                return k.propertyId == data.propertyId;
            }
        }
    }

    const registeredData: RegistryData[] = [];

    export function tryRegisterAttached(targetType: Type, property: DependencyProperty, name: string, metadata: PropertyMetadata): boolean {
        const data = DependencyPropertyData.create(name, targetType, metadata, true, false);
        return DependencyPropertyData.tryRegister(property, data);
    }

    export function tryRegisterReadonly(targetType: Type, property: DependencyProperty, name: string, key: DependencyPropertyKey, metadata: PropertyMetadata) {
        const data = DependencyPropertyData.create(name, targetType, metadata, true, true);
        if (!DependencyPropertyData.tryRegister(property, data))
            return false;
        const propertyId = data.id;
        const keyData = DependencyPropertyKeyData.create(propertyId);
        return DependencyPropertyKeyData.tryRegister(key, keyData);
    }

    export function tryRegister(targetType: Type, property: DependencyProperty, name: string, metadata: PropertyMetadata) {
        const data = DependencyPropertyData.create(name, targetType, metadata, false, false);
        return DependencyPropertyData.tryRegister(property, data);
    }

    export function tryGetMetadata(property: DependencyProperty, outMetadata: OutputArgument<PropertyMetadata>): boolean {
        const outData: OutputArgument<DependencyPropertyData> = {};
        if (!RegistryData.tryGet(property.id, outData))
            return false;
        outMetadata.value = outData.value!.metadata;
        return true;
    }

    export function tryGetName(property: DependencyProperty, outName: OutputArgument<string>): boolean {
        const outData: OutputArgument<DependencyPropertyData> = {};
        if (!RegistryData.tryGet(property.id, outData))
            return false;
        outName.value = outData.value!.name;
        return true;
    }

    export function tryGetIsReadonly(property: DependencyProperty, outIsReadonly: OutputArgument<boolean>): boolean {
        const outData: OutputArgument<DependencyPropertyData> = {};
        if (!RegistryData.tryGet(property.id, outData))
            return false;
        outIsReadonly.value = outData.value!.isReadonly;
        return true;
    }

    export function tryGetPropertyByPropertyKey(key: DependencyPropertyKey, outProperty: OutputArgument<DependencyProperty>): boolean {
        const outPropertyId: OutputArgument<Guid> = {};
        if (!DependencyPropertyData.tryGetIdByKeyId(key.id, outPropertyId))
            return false;
        const id = outPropertyId.value!
        const property = new DependencyProperty();
        property.__id = id;
        outProperty.value = property;
        return true;
    }

    export function getAll(targetType: Type): DependencyProperty[] {
        return DependencyPropertyData.getAllPropIdsForTargetType(targetType).map(id => createProperty(id));

        function createProperty(id: Guid) {
            const prop = new DependencyProperty();
            prop.__id = id;
            return prop;
        }
    }
}