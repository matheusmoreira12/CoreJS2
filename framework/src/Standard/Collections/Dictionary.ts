import { Collection, KeyValuePair } from "./index.js";
import { ArgumentOutOfRangeException, KeyNotFoundException } from "../index.js";

export class Dictionary<TKey, TValue> extends Collection<KeyValuePair<TKey, TValue>> {
    static fromMap<TKey, TValue>(map: Map<TKey, TValue>): Dictionary<TKey, TValue> {
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

    get(key: TKey): TValue {
        let item = this.find(item => item.key === key);
        if (item === undefined)
            throw new KeyNotFoundException();
        return item.value;
    }

    has(key: TKey): boolean {
        return this.find(i => i.key === key) !== undefined;
    }

    set(key: TKey, value: TValue): void {
        if (key === undefined)
            throw new ArgumentOutOfRangeException("key");
        if (value === undefined)
            throw new ArgumentOutOfRangeException("value");

        if (this.has(key))
            this.delete(key);

        this.add(new KeyValuePair(key, value));
    }

    *getKeys(): Generator<TKey> {
        for (let item of this)
            yield item.key;
    }

    *getValues(): Generator<TValue> {
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
