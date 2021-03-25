/**
 * KeyValuePair class
 */
export class KeyValuePair<TKey, TValue> {
    static fromMapItem<TKey, TValue>(mapItem: { 0: TKey; 1: TValue; }) {
        let { 0: key, 1: value } = mapItem;
        return new KeyValuePair<TKey, TValue>(key, value);
    }
    constructor(key: TKey, value: TValue) {
        this.__key = key;
        this.__value = value;
    }
    invert(): KeyValuePair<TValue, TKey> {
        return new KeyValuePair(this.value, this.key);
    }
    get key(): TKey { return this.__key; }
    private __key: TKey;
    get value(): TValue { return this.__value; }
    private __value: TValue;
}
