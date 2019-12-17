export declare namespace Core.Standard.Collections {
    /**
     * Collection Class
     * Represents a collection of values.
     */
    class Collection<T> extends Array<T> {
        constructor(length: number);
        constructor(...items: T[]);
        readonly first: T;
        readonly last: T;
        getRange(index: any, itemCount: any): Generator<T, void, unknown>;
        add(item: any): void;
        addMultiple(items: any): void;
        insert(index: any, item: any): void;
        insertMultiple(index: any, items: any): void;
        move(oldIndex: any, newIndex: any): void;
        swap(index1: any, index2: any): void;
        replace(oldItem: any, newItem: any): void;
        removeAt(index: any): T;
        remove(item: any): void;
    }
    export const ObservableCollectionChangeAction: any;
    export class ObservableCollection<T> extends Collection<T> {
        _notifySplice(start: any, deleteCount: any, ...items: any[]): void;
        _notifyPush(...items: any[]): void;
        _notifyPop(): void;
        splice(start: any, deleteCount: any, ...items: any[]): T[];
        push(...items: any[]): void;
        pop(): T;
        ChangeEvent: any;
    }
    /**
     * KeyValuePair class
     */
    export class KeyValuePair {
        static fromMapItem(mapItem: any): KeyValuePair;
        constructor(key: any, value: any);
    }
    /**
     * Dictionary class
     *
     */
    export class Dictionary extends Collection<KeyValuePair> {
        constructor(...items: any[]);
        static fromMap(map: any): Dictionary;
        static fromKeyValueObject(obj: any): Dictionary;
        get(key: any): any;
        has(key: any): boolean;
        set(key: any, value: any): void;
        keys(): Generator<any, void, unknown>;
        values(): Generator<any, void, unknown>;
        delete(key: any): void;
    }
    export const ObservableDictionaryChangeAction: any;
    export class ObservableDictionary extends Dictionary {
        constructor(entries: any);
        _notifySet(key: any, value: any): void;
        _notifyDelete(key: any): void;
        set(key: any, value: any): void;
        delete(key: any): void;
        ChangeEvent: any;
    }
    export {};
}
