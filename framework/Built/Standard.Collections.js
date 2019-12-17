import { ArgumentOutOfRangeException, KeyNotFoundException } from "./exceptions";
import { Enumeration } from "./Standard.Enumeration";
import { FrameworkEvent } from "./Standard.Events";
var Core;
(function (Core) {
    var Standard;
    (function (Standard) {
        var Collections;
        (function (Collections) {
            /**
             * Collection Class
             * Represents a collection of values.
             */
            class Collection extends Array {
                constructor(...args) {
                    super(...args);
                }
                get first() { return this[0]; }
                get last() { return this[this.length - 1]; }
                *getRange(index, itemCount) {
                    if (index < 0 || index >= this.length)
                        throw new ArgumentOutOfRangeException("index");
                    if (itemCount < 0 || itemCount + index >= this.length)
                        throw new ArgumentOutOfRangeException("itemCount");
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
                    if (oldIndex < 0 || oldIndex >= this.length)
                        throw new ArgumentOutOfRangeException("oldIndex");
                    if (newIndex < 0 || newIndex >= this.length)
                        throw new ArgumentOutOfRangeException("newIndex");
                    let item = this.removeAt(oldIndex);
                    if (newIndex > oldIndex)
                        newIndex--; //Compensate for the item removal
                    this.insert(newIndex, item);
                }
                swap(index1, index2) {
                    if (index1 < 0 || index1 >= this.length)
                        throw new ArgumentOutOfRangeException("index1");
                    if (index2 < 0 || index2 >= this.length)
                        throw new ArgumentOutOfRangeException("index2");
                    [this[index1], this[index2]] = [this[index2], this[index1]];
                }
                replace(oldItem, newItem) {
                    let index = this.indexOf(oldItem);
                    if (index === -1)
                        throw new KeyNotFoundException();
                    this[index] = newItem;
                }
                removeAt(index) {
                    if (index < 0 || index >= this.length)
                        throw new ArgumentOutOfRangeException("index");
                    return this.splice(index, 1)[0];
                }
                remove(item) {
                    let index = this.indexOf(item);
                    if (index === -1)
                        throw new KeyNotFoundException();
                    this.removeAt(index);
                }
            }
            /*
             * ObservableCollection class
             * Creates a collection observable via the "change" event.
             */
            Collections.ObservableCollectionChangeAction = new Enumeration({ Add: 1, Remove: 2 });
            class ObservableCollection extends Collection {
                constructor() {
                    super(...arguments);
                    this.ChangeEvent = new FrameworkEvent();
                }
                _notifySplice(start, deleteCount, ...items) {
                    let action = (items.length > 0 ? Collections.ObservableCollectionChangeAction.Add : 0) |
                        (deleteCount > 0 ? Collections.ObservableCollectionChangeAction.Remove : 0);
                    if (action === 0)
                        return;
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
                        action: Collections.ObservableCollectionChangeAction.Add,
                        oldIndex: null,
                        oldItems: [],
                        newIndex,
                        newItems: items
                    });
                }
                _notifyPop() {
                    const oldIndex = this.length - 1, oldItem = this.last;
                    this.ChangeEvent.invoke(this, {
                        action: Collections.ObservableCollectionChangeAction.Remove,
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
            }
            Collections.ObservableCollection = ObservableCollection;
            /**
             * KeyValuePair class
             */
            class KeyValuePair {
                static fromMapItem(mapItem) {
                    let { 0: key, 1: value } = mapItem;
                    return new KeyValuePair(key, value);
                }
                constructor(key, value) {
                    this.key = key;
                    this.value = value;
                }
            }
            Collections.KeyValuePair = KeyValuePair;
            /**
             * Dictionary class
             *
             */
            class Dictionary extends Collection {
                constructor(...items) {
                    super(items);
                }
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
                    let item = this.find(item => item.key === key);
                    if (item === undefined)
                        return undefined;
                    return item.value;
                }
                has(key) {
                    return this.get(key) !== undefined;
                }
                set(key, value) {
                    if (key === undefined)
                        throw new ArgumentOutOfRangeException("key");
                    if (value === undefined)
                        throw new ArgumentOutOfRangeException("value");
                    if (this.has(key))
                        this.delete(key);
                    this.add(new KeyValuePair(key, value));
                }
                *keys() {
                    for (let pair of this)
                        yield pair.key;
                }
                *values() {
                    for (let pair of this)
                        yield pair.value;
                }
                delete(key) {
                    const item = this.find(item => item.key === key);
                    if (item === undefined)
                        throw new KeyNotFoundException("key");
                    this.remove(item);
                }
            }
            Collections.Dictionary = Dictionary;
            /*
             * ObservableDictionary class
             * Creates a dictionary observable via the "change" event.
             */
            Collections.ObservableDictionaryChangeAction = new Enumeration([
                "Add",
                "Change",
                "Delete"
            ]);
            class ObservableDictionary extends Dictionary {
                constructor(entries) {
                    super(entries);
                    this.ChangeEvent = new FrameworkEvent();
                }
                _notifySet(key, value) {
                    if (this.has(key)) {
                        let oldValue = this.get(value);
                        ChangeEvent.invoke(this, {
                            action: Collections.ObservableDictionaryChangeAction.Change,
                            key,
                            oldValue,
                            newValue: value,
                        });
                    }
                    else
                        ChangeEvent.invoke(this, {
                            action: Collections.ObservableDictionaryChangeAction.Add,
                            key,
                            oldValue: undefined,
                            newValue: value
                        });
                }
                _notifyDelete(key) {
                    if (!this.has(key))
                        return;
                    let oldValue = this.get(key);
                    ChangeEvent.invoke(this, {
                        action: Collections.ObservableDictionaryChangeAction.Delete,
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
            }
            Collections.ObservableDictionary = ObservableDictionary;
        })(Collections = Standard.Collections || (Standard.Collections = {}));
    })(Standard = Core.Standard || (Core.Standard = {}));
})(Core || (Core = {}));
