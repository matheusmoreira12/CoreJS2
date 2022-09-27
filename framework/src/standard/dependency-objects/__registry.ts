import { OutputArgument } from "../reflection/types.js";
import { DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "./index.js";
import { DependencyObjectClass } from "./dependency-object-class";
import { MapUtils } from "../../core-base/utils/map-utils.js";
import { Type } from "../reflection/index.js";

export namespace __Registry {
    interface RegisteredPropertyInfo {
        name: string,
        target: DependencyObjectClass,
        key: DependencyPropertyKey | null,
        metadata: PropertyMetadata,
        isAttached: boolean,
        isReadonly: boolean
    }

    namespace RegisteredPropertyInfo {
        export function create(name: string, target: DependencyObjectClass, metadata: PropertyMetadata, isAttached: boolean = false, isReadonly: boolean = false, key: DependencyPropertyKey | null = null): RegisteredPropertyInfo {
            return {
                name,
                target,
                key,
                metadata,
                isAttached,
                isReadonly
            };
        }
    }

    const registered: Map<DependencyProperty, RegisteredPropertyInfo> = new Map();

    export function tryRegisterAttached(target: DependencyObjectClass, property: DependencyProperty, name: string, metadata: PropertyMetadata): boolean {
        if (registered.has(property))
            return false;

        const info = RegisteredPropertyInfo.create(name, target, metadata, true);
        registered.set(property, info);
        return true;
    }

    export function tryRegisterReadonly(target: DependencyObjectClass, property: DependencyProperty, name: string, key: DependencyPropertyKey, metadata: PropertyMetadata) {
        if (registered.has(property))
            return false;

        const info = RegisteredPropertyInfo.create(name, target, metadata, false, true, key);
        registered.set(property, info);
        return true;
    }

    export function tryRegister(target: DependencyObjectClass, property: DependencyProperty, propertyName: string, metadata: PropertyMetadata) {
        if (registered.has(property))
            return false;

        const info = RegisteredPropertyInfo.create(propertyName, target, metadata, true);
        registered.set(property, info);
        return true;
    }

    export function tryGetMetadata(property: DependencyProperty, output: OutputArgument<PropertyMetadata> = {}): boolean {
        const info = registered.get(property)
        if (info === undefined)
            return false;
        output.value = info.metadata;
        return true;
    }

    export function tryGetName(property: DependencyProperty, output: OutputArgument<string> = {}): boolean {
        const info = registered.get(property)
        if (info === undefined)
            return false;
        output.value = info.name;
        return true;
    }

    export function tryGetIsReadonly(property: DependencyProperty, output: OutputArgument<boolean> = {}): boolean {
        const info = registered.get(property)
        if (info === undefined)
            return false;
        output.value = info.isReadonly;
        return true;
    }

    export function tryGetProperty(propertyKey: DependencyPropertyKey, output: OutputArgument<DependencyProperty> = {}): boolean {
        const prop = MapUtils.selectMap(registered, (k, v) => [v.key, k]).get(propertyKey);
        if (prop === undefined)
            return false;
        output.value = prop;
        return true;
    }

    export function getAll(target: DependencyObjectClass): IterableIterator<DependencyProperty> {
        return MapUtils.keysWhere(registered, (_, v) => Type.get(target).extends(Type.get(v.target)));
    }
}