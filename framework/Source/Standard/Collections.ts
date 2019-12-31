import { ArgumentOutOfRangeException, KeyNotFoundException } from "./Exceptions.js";
import { Enumeration } from "./Enumeration.js";
import { FrameworkEvent } from "./Events.js";

/**
 * Collection Class
 * Represents a collection of values.
 */
export class Collection<T> extends Array<T> {
    constructor(length: number);
    constructor(...items: T[]);
    constructor(...args: any) {
        super(...args);
    }

    get first(): T { return this[0]; }

    get last(): T { return this[this.length - 1]; }

    * getRange(index, itemCount): Generator<T> {
        if (index < 0 || index >= this.length) throw new ArgumentOutOfRangeException("index");
        if (itemCount < 0 || itemCount + index >= this.length) throw new ArgumentOutOfRangeException("itemCount");

        for (let i = index; i < index + itemCount; i++)
            yield this[i];
    }

    add(item: T): void {
        this.push(item);
    }

    addMultiple(items: Iterable<T>): void {
        this.push(...items);
    }

    insert(index: number, item: T): void {
        this.splice(index, 0, item);
    }

    insertMultiple(index: number, items: Iterable<T>): void {
        this.splice(index, 0, ...items);
    }

    move(oldIndex: number, newIndex: number): void {
        if (oldIndex < 0 || oldIndex >= this.length) throw new ArgumentOutOfRangeException("oldIndex");
        if (newIndex < 0 || newIndex >= this.length) throw new ArgumentOutOfRangeException("newIndex");

        let item = this.removeAt(oldIndex);

        if (newIndex > oldIndex)
            newIndex--; //Compensate for the item removal

        this.insert(newIndex, item);
    }

    swap(index1: number, index2: number): void {
        if (index1 < 0 || index1 >= this.length) throw new ArgumentOutOfRangeException("index1");
        if (index2 < 0 || index2 >= this.length) throw new ArgumentOutOfRangeException("index2");

        [this[index1], this[index2]] = [this[index2], this[index1]];
    }

    replace(oldItem: T, newItem: T): void {
        let index = this.indexOf(oldItem);
        if (index === -1) throw new KeyNotFoundException();

        this[index] = newItem;
    }

    removeAt(index: number): T {
        if (index < 0 || index >= this.length) throw new ArgumentOutOfRangeException("index");

        return this.splice(index, 1)[0];
    }

    remove(item: T): void {
        let index = this.indexOf(item);
        if (index === -1) throw new KeyNotFoundException();

        this.removeAt(index);
    }
}

/*
 * ObservableCollection class
 * Creates a collection observable via the "change" event.
 */
export const ObservableCollectionChangeAction = new Enumeration({ Add: 1, Remove: 2 });

export class ObservableCollection<T> extends Collection<T> {
    __notifySplice(start, deleteCount, ...items) {
        let action = (items.length > 0 ? ObservableCollectionChangeAction.Add : 0) |
            (deleteCount > 0 ? ObservableCollectionChangeAction.Remove : 0);

        if (action === 0) return;

        const oldItems = Array.from(this.getRange(start, deleteCount));

        this.ChangeEvent.invoke(this, {
            action,
            oldIndex: start,
            oldItems,
            newIndex: start,
            newItems: items
        });
    }

    __notifyPush(...items) {
        const newIndex = this.length - 1;

        this.ChangeEvent.invoke(this, {
            action: ObservableCollectionChangeAction.Add,
            oldIndex: null,
            oldItems: [],
            newIndex,
            newItems: items
        });
    }

    __notifyPop() {
        const oldIndex = this.length - 1,
            oldItem = this.last;

        this.ChangeEvent.invoke(this, {
            action: ObservableCollectionChangeAction.Remove,
            oldIndex,
            oldItems: [oldItem],
            newIndex: null,
            newItems: []
        });
    }

    splice(start: number, deleteCount: number, ...items: T[]) {
        this.__notifySplice(start, deleteCount, ...items);

        return super.splice(start, deleteCount, ...items);
    }

    push(...items: T[]): number {
        this.__notifyPush(...items);

        return super.push(...items);
    }

    pop(): T {
        this.__notifyPop();

        return super.pop();
    }

    get ChangeEvent(): FrameworkEvent { return this.__ChangeEvent; }
    __ChangeEvent = new FrameworkEvent();
}

export type ObservableCollectionChangeArgs<T> = { action: number, oldItems: T[], oldIndex: number, newItems: T[], newIndex: number };

/**
 * KeyValuePair class
 */
export class KeyValuePair<TKey, TValue> {
    static fromMapItem<TKey, TValue>(mapItem: { 0: TKey, 1: TValue }) {
        let { 0: key, 1: value } = mapItem;

        return new KeyValuePair<TKey, TValue>(key, value);
    }

    constructor(key: TKey, value: TValue) {
        this.__key = key;
        this.__value = value;
    }

    get key(): TKey { return this.__key; }
    private __key: TKey;

    get value(): TValue { return this.__value; }
    private __value: TValue;
}

/**
 * Dictionary class
 * 
 */
export class Dictionary<TKey, TValue> extends Collection<KeyValuePair<TKey, TValue>> {
    static fromMap<TKey, TValue>(map: Map<TKey, TValue>) {
        function* getItems() {
            for (let mapItem of map)
                yield KeyValuePair.fromMapItem(mapItem);
        }

        return new Dictionary<TKey, TValue>(...getItems());
    }

    static fromKeyValueObject(obj): Dictionary<string, any> {
        function* getEntries(obj) {
            for (let key in obj) {
                let value = obj[key];
                yield new KeyValuePair<string, any>(key, value);
            }
        }

        return new Dictionary(...getEntries(obj));
    }

    get(key: TKey): TValue {
        let item = this.find(item => item.key === key);
        if (item === undefined)
            return undefined;

        return item.value;
    }

    has(key: TKey): boolean {
        return this.get(key) !== undefined;
    }

    set(key: TKey, value: TValue) {
        if (key === undefined) throw new ArgumentOutOfRangeException("key");
        if (value === undefined) throw new ArgumentOutOfRangeException("value");

        if (this.has(key))
            this.delete(key);

        this.add(new KeyValuePair(key, value));
    }

    *getKeys() {
        for (let item of this)
            yield item.key;
    }

    *getValues() {
        for (let item of this)
            yield item.value;
    }

    delete(key: TKey): void {
        const item = this.find(item => item.key === key);
        if (item === undefined) throw new KeyNotFoundException("key");

        this.remove(item);
    }
}

/*
 * ObservableDictionary class
 * Creates a dictionary observable via the "change" event.
 */
export const ObservableDictionaryChangeAction = new Enumeration([
    "Add",
    "Change",
    "Delete"
]);

export class ObservableDictionary<TKey, TValue> extends Dictionary<TKey, TValue> {
    private __notifySet(key, value) {
        if (this.has(key)) {
            let oldValue = this.get(value);

            this.ChangeEvent.invoke(this, {
                action: ObservableDictionaryChangeAction.Change,
                key,
                oldValue,
                newValue: value,
            });
        }
        else
            this.ChangeEvent.invoke(this, {
                action: ObservableDictionaryChangeAction.Add,
                key,
                oldValue: undefined,
                newValue: value
            });
    }

    private __notifyDelete(key) {
        if (!this.has(key)) return;

        let oldValue = this.get(key);

        this.ChangeEvent.invoke(this, {
            action: ObservableDictionaryChangeAction.Delete,
            key,
            oldValue,
            newValue: undefined
        });
    }

    set(key: TKey, value: TValue) {
        this.__notifySet(key, value);

        super.set(key, value);
    }

    delete(key: TKey) {
        this.__notifyDelete(key);

        super.delete(key);
    }

    get ChangeEvent() { return this.__ChangeEvent; }
    __ChangeEvent = new FrameworkEvent();
}

export type ObservableDictionaryChangeArgs<TKey, TValue> = { action: number, key: TKey, oldValue: TValue, newValue: TValue };
