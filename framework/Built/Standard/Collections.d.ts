import { Enumeration } from "./Enumeration";
import { FrameworkEvent } from "./Events";
/**
 * Collection Class
 * Represents a collection of values.
 */
export declare class Collection<T> extends Array<T> {
    constructor(length: number);
    constructor(...items: T[]);
    readonly first: T;
    readonly last: T;
    getRange(index: any, itemCount: any): Generator<T>;
    add(item: T): void;
    addMultiple(items: Iterable<T>): void;
    insert(index: number, item: T): void;
    insertMultiple(index: number, items: Iterable<T>): void;
    move(oldIndex: number, newIndex: number): void;
    swap(index1: number, index2: number): void;
    replace(oldItem: T, newItem: T): void;
    removeAt(index: number): T;
    remove(item: T): void;
}
export declare const ObservableCollectionChangeAction: Enumeration<number>;
export declare class ObservableCollection<T> extends Collection<T> {
    __notifySplice(start: any, deleteCount: any, ...items: any[]): void;
    __notifyPush(...items: any[]): void;
    __notifyPop(): void;
    splice(start: number, deleteCount: number, ...items: T[]): T[];
    push(...items: T[]): number;
    pop(): T;
    readonly ChangeEvent: FrameworkEvent;
    __ChangeEvent: FrameworkEvent;
}
export declare type ObservableCollectionChangeArgs<T> = {
    action: number;
    oldItems: T[];
    oldIndex: number;
    newItems: T[];
    newIndex: number;
};
/**
 * KeyValuePair class
 */
export declare class KeyValuePair<TKey, TValue> {
    static fromMapItem<TKey, TValue>(mapItem: {
        0: TKey;
        1: TValue;
    }): KeyValuePair<TKey, TValue>;
    constructor(key: TKey, value: TValue);
    readonly key: TKey;
    private __key;
    readonly value: TValue;
    private __value;
}
/**
 * Dictionary class
 *
 */
export declare class Dictionary<TKey, TValue> extends Collection<KeyValuePair<TKey, TValue>> {
    static fromMap<TKey, TValue>(map: Map<TKey, TValue>): Dictionary<TKey, TValue>;
    static fromKeyValueObject(obj: any): Dictionary<string, any>;
    get(key: TKey): TValue;
    has(key: TKey): boolean;
    set(key: TKey, value: TValue): void;
    getKeys(): Generator<TKey, void, unknown>;
    getValues(): Generator<TValue, void, unknown>;
    delete(key: TKey): void;
}
export declare const ObservableDictionaryChangeAction: Enumeration<import("./Enumeration").EnumerationValue>;
export declare class ObservableDictionary<TKey, TValue> extends Dictionary<TKey, TValue> {
    private __notifySet;
    private __notifyDelete;
    set(key: TKey, value: TValue): void;
    delete(key: TKey): void;
    readonly ChangeEvent: FrameworkEvent;
    __ChangeEvent: FrameworkEvent;
}
export declare type ObservableDictionaryChangeArgs<TKey, TValue> = {
    action: number;
    key: TKey;
    oldValue: TValue;
    newValue: TValue;
};
