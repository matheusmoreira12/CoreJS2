import { ArgumentOutOfRangeException, KeyNotFoundException } from "./Exceptions";
import { Enumeration } from "./Enumeration";
import { FrameworkEvent } from "./Events";

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

    get first() { return this[0]; }

    get last() { return this[this.length - 1]; }

    * getRange(index, itemCount) {
        if (index < 0 || index >= this.length) throw new ArgumentOutOfRangeException("index");
        if (itemCount < 0 || itemCount + index >= this.length) throw new ArgumentOutOfRangeException("itemCount");

        for (let i = index; i < index + itemCount; i++)
            yield this[i];
    }

    add(item) {
        this.push(item);
    }

    addMultiple(items) {
        this.push(...items);
    }

    insert(index, item) {
        this.splice(index, 0, item);
    }

    insertMultiple(index, items) {
        this.splice(index, 0, ...items);
    }

    move(oldIndex, newIndex) {
        if (oldIndex < 0 || oldIndex >= this.length) throw new ArgumentOutOfRangeException("oldIndex");
        if (newIndex < 0 || newIndex >= this.length) throw new ArgumentOutOfRangeException("newIndex");

        let item = this.removeAt(oldIndex);

        if (newIndex > oldIndex)
            newIndex--; //Compensate for the item removal

        this.insert(newIndex, item);
    }

    swap(index1, index2) {
        if (index1 < 0 || index1 >= this.length) throw new ArgumentOutOfRangeException("index1");
        if (index2 < 0 || index2 >= this.length) throw new ArgumentOutOfRangeException("index2");

        [this[index1], this[index2]] = [this[index2], this[index1]];
    }

    replace(oldItem, newItem) {
        let index = this.indexOf(oldItem);
        if (index === -1) throw new KeyNotFoundException();

        this[index] = newItem;
    }

    removeAt(index) {
        if (index < 0 || index >= this.length) throw new ArgumentOutOfRangeException("index");

        return this.splice(index, 1)[0];
    }

    remove(item) {
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
    _notifySplice(start, deleteCount, ...items) {
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

    _notifyPush(...items) {
        const newIndex = this.length - 1;

        this.ChangeEvent.invoke(this, {
            action: ObservableCollectionChangeAction.Add,
            oldIndex: null,
            oldItems: [],
            newIndex,
            newItems: items
        });
    }

    _notifyPop() {
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

    splice(start, deleteCount, ...items) {
        this._notifySplice(start, deleteCount, ...items);

        return super.splice(start, deleteCount, ...items);
    }

    push(...items) {
        this._notifyPush(...items);

        super.push(...items);
    }

    pop() {
        this._notifyPop();

        return super.pop();
    }

    ChangeEvent = new FrameworkEvent();
}

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
    constructor(...items: KeyValuePair<TKey, TValue>[]) {
        super(...items);
    }

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
    constructor(entries) {
        super(entries);
    }

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