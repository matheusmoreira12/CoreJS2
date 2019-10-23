import { Enumeration } from "./Standard.Enumeration.js";

/**
 * Collection Class
 * Represents a collection of values.
 */
export class Collection extends Array {

    get first() { return this[0]; }

    get last() { return this[this.length - 1]; }

    * getRange(index, itemCount) {
        if (index < 0 || index > this.length - 1) throw new IndexOutOfRangeException();

        if (itemCount < 0 || itemCount > this.length - index) throw new IndexOutOfRangeException();

        for (let i = index; i < index + itemCount; i++)
            yield this[i];
    }

    add(item) { this.push(item); }

    insert(index, item) { this.splice(index, 0, item); }

    move(oldIndex, newIndex) {
        let item = this.removeAt(oldIndex);

        if (newIndex > oldIndex) newIndex--;

        this.insert(newIndex, item);
    }

    swap(index1, index2) {
        [this[index1], this[index2]] = [this[index2], this[index1]];
    }

    replace(oldItem, newItem) {
        let index = this.indexOf(oldItem);

        if (index === -1) throw new InvalidOperationException("Cannot replace item. Item not found.");

        this[index] = newItem;
    }

    removeAt(index) { return this.splice(index, 1)[0]; }

    remove(item) {
        let index = this.indexOf(item);

        if (index === -1) throw new InvalidOperationException("Cannot remove item. Item not found.");

        this.removeAt(index);
    }
}

/*
 * ObservableCollection class
 * Creates a collection observable via the "change" event.
 */
export const ObservableCollectionChangeAction = Enumeration.create({ Add: 1, Remove: 2 });

export class ObservableCollection extends Collection {
    _notifySplice(start, deleteCount, ...items) {
        let action = (items.length > 0 ? ObservableCollectionChangeAction.Add : 0) |
            (deleteCount > 0 ? ObservableCollectionChangeAction.Remove : 0);

        if (action == 0) return;

        action = new ObservableCollectionChangeAction(action);

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
export class KeyValuePair {
    static fromMapItem(mapItem) {
        let { 0: key, 1: value } = mapItem;

        return new KeyValuePair(key, value);
    }

    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

/**
 * Dictionary class
 * 
 */
export class Dictionary extends Collection {
    static fromMap(map) {
        function* getItems() {
            for (let mapItem of map)
                yield KeyValuePair.fromMapItem(mapItem);
        }

        return new Dictionary(...getItems());
    }

    static fromKeyValueObject(obj) {
        function* getEntries(obj) {
            for (let key in obj) {
                let value = obj[key];
                yield new KeyValuePair(key, value);
            }
        }

        return new Dictionary(...getEntries(obj));
    }

    get(key) {
        for (let item of this) {
            if (item.key === key)
                return item;
        }

        return undefined;
    }

    has(key) {
        return this.get(key) !== undefined;
    }

    set(key, value) {
        if (value === undefined) return;

        if (this.has(key))
            this.remove(key);

        this.add(key);
    }

    delete(key) {
        if (!this.has(key)) return;

        this.remove(item);
    }
}

window.Dictionary = Dictionary;

/*
 * ObservableDictionary class
 * Creates a dictionary observable via the "change" event.
 */
export const ObservableDictionaryChangeAction = Enumeration.create([
    "Add",
    "Change",
    "Delete"
]);

export class ObservableDictionary extends Dictionary {
    constructor(entries) {
        super(entries);
    }

    _notifySet(key, value) {
        if (this.has(key)) {
            let oldValue = this.get(value);

            ChangeEvent.invoke(this, {
                action: ObservableDictionaryChangeAction.Change,
                key,
                oldValue,
                newValue: value,
            });
        }
        else
            ChangeEvent.invoke(this, {
                action: ObservableDictionaryChangeAction.Add,
                key,
                oldValue: undefined,
                newValue: value
            });
    }

    _notifyDelete(key) {
        if (!this.has(key)) return;

        let oldValue = this.get(key);

        ChangeEvent.invoke(this, {
            action: ObservableDictionaryChangeAction.Delete,
            key,
            oldValue,
            newValue: undefined
        });
    }

    set(key, value) {
        this._notifySet(key, value);

        return super.set(key, value);
    }

    delete(key) {
        this._notifyDelete(key);

        return super.delete(key);
    }

    ChangeEvent = new FrameworkEvent();
}