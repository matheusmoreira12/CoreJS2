import { OutputArgument } from "../reflection/types.js";
import { DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "./index.js";
import { Type } from "../reflection/index.js";
import { IdentifierGenerator } from "../../core-base/index.js";
import { ArrayUtils, MapUtils } from "../../core-base/utils/index.js";

export namespace __Registry {
    interface RegistryData {
        isDependencyProperty: boolean;
        isDependencyPropertyKey: boolean;
    }

    namespace RegistryData {
        export function register(data: RegistryData): bigint {
            const id = idGen.generate();
            registeredData.set(id, data);
            return id;
        }

        export function tryGet(id: bigint, outData: OutputArgument<RegistryData>) {
            const data = registeredData.get(id);
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
                name,
                targetType,
                metadata,
                isAttached,
                isReadonly,
            };
        }

        export function tryRegister(prop: DependencyProperty, data: DependencyPropertyData, outId: OutputArgument<bigint>): boolean {
            const isAlreadyRegistered = ArrayUtils.any(MapUtils.select(registeredData, (_, v) => v), d => d.isDependencyProperty && nameMatches(d as DependencyPropertyData) && attachmentMatches(d as DependencyPropertyData) && targetTypeMatches(d as DependencyPropertyData));
            if (isAlreadyRegistered)
                return false;
            outId.value = prop.__id = RegistryData.register(data);
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

        export function tryGetPropIdByKeyId(keyId: bigint, outId: OutputArgument<bigint>) {
            const outKeyData: OutputArgument<DependencyPropertyKeyData> = {};
            if (!RegistryData.tryGet(keyId, outKeyData))
                return false;
            const keyData = outKeyData.value!;
            outId.value = keyData.propertyId;
            return true;
        }

        export function getAllPropIdsForTargetType(targetType: Type) {
            return ArrayUtils.select(ArrayUtils.where(MapUtils.select(registeredData, (id, d) => [id, d] as const), ([, d]) => d.isDependencyProperty && targetTypeMatches(d as DependencyPropertyData)), ([k,]) => k);

            function targetTypeMatches(p: DependencyPropertyData) {
                return p.targetType.equals(targetType) || targetType.extends(p.targetType);
            }
        }
    }

    interface DependencyPropertyKeyData extends RegistryData {
        isDependencyPropertyKey: true;
        propertyId: bigint;
    }

    namespace DependencyPropertyKeyData {
        export function create(propertyId: bigint): DependencyPropertyKeyData {
            return {
                isDependencyProperty: false,
                isDependencyPropertyKey: true,
                propertyId,
            };
        }

        export function tryRegister(propKey: DependencyPropertyKey, data: DependencyPropertyKeyData): boolean {
            const isAlreadyRegistered = ArrayUtils.any(MapUtils.select(registeredData, (_, v) => v), d => d.isDependencyPropertyKey && propIdMatches(d as DependencyPropertyKeyData));
            if (isAlreadyRegistered)
                return false;
            const id = RegistryData.register(data);
            propKey.__id = id;
            return true;

            function propIdMatches(k: DependencyPropertyKeyData) {
                return k.propertyId == data.propertyId;
            }
        }
    }

    const idGen = new IdentifierGenerator();

    const registeredData: Map<bigint, RegistryData> = new Map();

    export function tryRegisterAttached(targetType: Type, property: DependencyProperty, name: string, metadata: PropertyMetadata): boolean {
        const data = DependencyPropertyData.create(name, targetType, metadata, true, false);
        return DependencyPropertyData.tryRegister(property, data, {});
    }

    export function tryRegisterReadonly(targetType: Type, property: DependencyProperty, name: string, key: DependencyPropertyKey, metadata: PropertyMetadata) {
        const data = DependencyPropertyData.create(name, targetType, metadata, true, true);
        const outPropertyId: OutputArgument<bigint> = {};
        if (!DependencyPropertyData.tryRegister(property, data, outPropertyId))
            return false;
        const propertyId = outPropertyId.value!;
        const keyData = DependencyPropertyKeyData.create(propertyId);
        return DependencyPropertyKeyData.tryRegister(key, keyData);
    }

    export function tryRegister(targetType: Type, property: DependencyProperty, name: string, metadata: PropertyMetadata) {
        const data = DependencyPropertyData.create(name, targetType, metadata, false, false);
        return DependencyPropertyData.tryRegister(property, data, {});
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
        const outPropertyId: OutputArgument<bigint> = {};
        if (!DependencyPropertyData.tryGetPropIdByKeyId(key.id, outPropertyId))
            return false;
        const id = outPropertyId.value!
        const property = new DependencyProperty();
        property.__id = id;
        outProperty.value = property;
        return true;
    }

    export function getAll(targetType: Type): DependencyProperty[] {
        return Array.from(ArrayUtils.select(DependencyPropertyData.getAllPropIdsForTargetType(targetType), id => createProperty(id)));

        function createProperty(id: bigint) {
            const prop = new DependencyProperty();
            prop.__id = id;
            return prop;
        }
    }
}