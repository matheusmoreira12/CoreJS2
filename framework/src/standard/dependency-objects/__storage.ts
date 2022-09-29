import { __Registry } from "./__registry.js";
import { OutputArgument } from "../reflection/types";
import { DependencyObject, DependencyProperty, DependencyPropertyKey, PropertyChangeEventArgs, PropertyMetadata } from "./index.js";
import { ArrayUtils } from "../../core-base/utils/array-utils.js";

export namespace __Storage {
    const stored: Map<DependencyProperty, PropertyStorageInfo> = new Map();

    interface PropertyStorageInfo {
        storedValues: Map<DependencyObject, StoredValueInfo[]>;
    }

    namespace PropertyStorageInfo {
        export function create(): PropertyStorageInfo {
            return { storedValues: new Map() };
        }
    }

    interface StoredValueInfo {
        source: object,
        value: any
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
        return doTrySetValue(propertyOrPropertyKey.property);

        function doTrySetValue(property: DependencyProperty): boolean {
            const outOldValue: OutputArgument<any> = {};
            if (!tryGetValue(target, property, outOldValue))
                return false;
            if (!tryRemoveStoredValue(source, target, property))
                return false;
            if (!tryAddStoredValue(source, target, property, value))
                return false;
            notifyValueChange(source, target, property, outOldValue.value!, value);
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
            notifyValueChange(source, target, property, outNewValue.value!, outNewValue.value!);
            return true;
        }
    }

    function tryRemoveStoredValue(source: object, target: DependencyObject, property: DependencyProperty): boolean {
        const outStoredValues: OutputArgument<StoredValueInfo[]> = {};
        if (!tryGetOrCreateStoredValues(target, property, outStoredValues))
            return false;
        ArrayUtils.removeWhere(outStoredValues.value!, v => v.source === source);
        return true;
    }

    function tryAddStoredValue(source: object, target: DependencyObject, property: DependencyProperty, value: any): boolean {
        const outStoredValues: OutputArgument<StoredValueInfo[]> = {};
        if (!tryGetOrCreateStoredValues(target, property, outStoredValues))
            return false;
        const newSetter = StoredValueInfo.create(source, value);
        outStoredValues.value!.push(newSetter);
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
        const outStoredValues: OutputArgument<StoredValueInfo[]> = {};
        if (!tryGetOrCreateStoredValues(target, property, outStoredValues))
            return false;
        const value = ArrayUtils.last(outStoredValues.value!);
        if (value === undefined) {
            outValue.value = outMetadata.value!.defaultValue;
            return true;
        }
        outValue.value = value!.value;
        return true;
    }

    function tryGetOrCreateStoredValues(target: DependencyObject, property: DependencyProperty, outStoredValues: OutputArgument<StoredValueInfo[]>): boolean {
        const propertyStorage = stored.get(property) ?? createPropertyStorage();
        outStoredValues.value = propertyStorage.storedValues.get(target) ?? createStoredValues();
        return true;

        function createPropertyStorage(): PropertyStorageInfo {
            const propertyStorage = PropertyStorageInfo.create();
            stored.set(property, propertyStorage);
            return propertyStorage;
        }

        function createStoredValues(): StoredValueInfo[] {
            const storedValues: StoredValueInfo[] = [];
            propertyStorage.storedValues.set(target, storedValues)
            return storedValues;
        }
    }
}