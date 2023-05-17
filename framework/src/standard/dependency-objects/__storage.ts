import { __Registry } from "./__registry.js";
import { OutputArgument } from "../reflection/types";
import { DependencyObject, DependencyProperty, DependencyPropertyKey, PropertyChangeEventArgs, PropertyMetadata } from "./index.js";
import { ArrayUtils } from "../../core-base/utils/array-utils.js";
import { Type } from "../reflection/index.js";

export namespace __Storage {
    const stored: Map<bigint, PropertyStorageInfo> = new Map();

    interface PropertyStorageInfo {
        storedValues: Map<bigint, StoredValueInfo[]>;
    }

    namespace PropertyStorageInfo {
        export function create(): PropertyStorageInfo {
            return { storedValues: new Map() };
        }
    }

    interface StoredValueInfo {
        source: object;
        value: any;
    };

    namespace StoredValueInfo {
        export function create(source: object, value: any): StoredValueInfo {
            return { source, value };
        }
    }

    export function trySetValue(source: object, target: DependencyObject, propertyOrPropertyKey: DependencyProperty | DependencyPropertyKey, value: any): boolean {
        if (propertyOrPropertyKey instanceof DependencyProperty) {
            const outIsReadonly: OutputArgument<boolean> = {};
            if (!__Registry.tryGetIsReadonly(propertyOrPropertyKey, outIsReadonly))
                return false;
            if (outIsReadonly.value!)
                return false;
            return doTrySetValue(propertyOrPropertyKey);
        }
        const outProperty: OutputArgument<DependencyProperty> = {};
        if (!__Registry.tryGetPropertyByPropertyKey(propertyOrPropertyKey, outProperty))
            return false;
        return doTrySetValue(propertyOrPropertyKey.property);

        function doTrySetValue(property: DependencyProperty): boolean {
            const outMetadata: OutputArgument<PropertyMetadata> = {};
            if (!__Registry.tryGetMetadata(property, outMetadata))
                return false;
            const valueType = outMetadata.value!.valueType;
            if (valueType !== null &&
                !Type.of(value).matches(valueType))
                return false;
            const outOldValue: OutputArgument<any> = {};
            if (!tryGetValue(target, property, outOldValue))
                return false;
            if (!tryRemoveStoredValue(source, target, property))
                return false;
            if (!tryAddStoredValue(source, target, property, value))
                return false;
            const oldValue = outOldValue.value!;
            if (value !== oldValue)
                notifyValueChange(source, target, property, oldValue, value);
            return true;
        }
    }

    export function tryUnsetValue(source: object, target: DependencyObject, propertyOrPropertyKey: DependencyProperty | DependencyPropertyKey): boolean {
        if (propertyOrPropertyKey instanceof DependencyProperty) {
            const outIsReadonly: OutputArgument<boolean> = {};
            if (!__Registry.tryGetIsReadonly(propertyOrPropertyKey, outIsReadonly))
                return false;
            if (outIsReadonly!.value)
                return false;
            return doTryUnsetValue(propertyOrPropertyKey);
        }
        return doTryUnsetValue((propertyOrPropertyKey as DependencyPropertyKey).property);

        function doTryUnsetValue(property: DependencyProperty): boolean {
            const outOldValue: OutputArgument<any> = {};
            if (!tryGetValue(target, property, outOldValue))
                return false;
            if (!tryRemoveStoredValue(source, target, property))
                return false;
            const outNewValue: OutputArgument<any> = {};
            if (!tryGetValue(target, property, outNewValue))
                return false;
            const oldValue = outOldValue.value!;
            const newValue = outNewValue.value!;
            if (newValue !== oldValue)
                notifyValueChange(source, target, property, oldValue, newValue);
            return true;
        }
    }

    function tryRemoveStoredValue(source: object, target: DependencyObject, property: DependencyProperty): boolean {
        const storedValues = getOrCreateStoredValues(target, property);
        ArrayUtils.removeWhere(storedValues, v => v.source === source);
        return true;
    }

    function tryAddStoredValue(source: object, target: DependencyObject, property: DependencyProperty, value: any): boolean {
        const storedValues = getOrCreateStoredValues(target, property);
        const newStoredValue = StoredValueInfo.create(source, value);
        storedValues.push(newStoredValue);
        return true;
    }

    function notifyValueChange(source: object, target: DependencyObject, property: DependencyProperty, oldValue: any, newValue: any) {
        const args = new PropertyChangeEventArgs(target, property, oldValue, newValue);
        target.PropertyChangeEvent.invoke(source, args);
    }

    export function tryGetValue(target: DependencyObject, property: DependencyProperty, outValue: OutputArgument<any>): boolean {
        const outMetadata: OutputArgument<PropertyMetadata> = {};
        if (!__Registry.tryGetMetadata(property, outMetadata))
            return false;
        const storedValues = getOrCreateStoredValues(target, property);
        outValue.value = ArrayUtils.last(storedValues)?.value ?? outMetadata.value!.defaultValue;
        return true;
    }

    function getOrCreateStoredValues(target: DependencyObject, property: DependencyProperty): StoredValueInfo[] {
        const propertyId = property.id;
        const propertyStorage = stored.has(propertyId) ? stored.get(propertyId)! : createPropertyStorage();
        const storedValues = propertyStorage.storedValues;
        const targetId = target.id;
        return storedValues.has(targetId) ? storedValues.get(targetId)! : createStoredValues();

        function createPropertyStorage(): PropertyStorageInfo {
            const propertyStorage = PropertyStorageInfo.create();
            stored.set(propertyId, propertyStorage);
            return propertyStorage;
        }

        function createStoredValues(): StoredValueInfo[] {
            const storedValues: StoredValueInfo[] = [];
            propertyStorage.storedValues.set(targetId, storedValues);
            return storedValues;
        }
    }
}