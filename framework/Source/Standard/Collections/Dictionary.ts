﻿import { Collection } from "./Collection.js";
import { KeyValuePair } from "./KeyValuePair.js";
import { ArgumentOutOfRangeException, KeyNotFoundException } from "../Exceptions.js";

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

    static fromKeyValueObject(obj: { [key: string]: any; }): Dictionary<string, any> {
        function* getEntries(obj: {
            [key: string]: any;
        }) {
            for (let key in obj) {
                let value = obj[key];
                yield new KeyValuePair<string, any>(key, value);
            }
        }
        return new Dictionary(...getEntries(obj));
    }

    get(key: TKey): TValue | undefined {
        let item = this.find(item => item.key === key);
        if (item === undefined)
            return undefined;
        return item.value;
    }

    has(key: TKey): boolean {
        return this.get(key) !== undefined;
    }

    set(key: TKey, value: TValue) {
        if (key === undefined)
            throw new ArgumentOutOfRangeException("key");
        if (value === undefined)
            throw new ArgumentOutOfRangeException("value");

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

    invert(): Dictionary<TValue, TKey> {
        return new Dictionary(...this.map(p => p.invert()));
    }

    delete(key: TKey): void {
        const item = this.find(item => item.key === key);
        if (item === undefined)
            throw new KeyNotFoundException("key");

        this.remove(item);
    }
}