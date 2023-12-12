import { ObjectUtils } from "../../../../core-base/utils/index.js";
import { NativeEvent } from "../../../../standard/events/index.js";
import { EventNameFromPropertyName, getEventNameFromPropertyName, isEventPropertyName } from "./index.js";

export type NativeEvents<T extends typeof Element> = {
    readonly [K in keyof T["prototype"] & string as EventNameFromPropertyName<K>]: NativeEvent;
};

export function getNativeEventNames<T extends typeof Element>(elemCtor: T): string[] {
    return [...ObjectUtils.getAllPropertyNames(elemCtor.prototype)]
        .filter(p => isEventPropertyName(p))
        .map(p => getEventNameFromPropertyName(p));
}