/**
* KeyValuePair class
*/
export declare class KeyValuePair<TKey, TValue> {
    static fromMapItem<TKey, TValue>(mapItem: {
        0: TKey;
        1: TValue;
    }): KeyValuePair<TKey, TValue>;
    constructor(key: TKey, value: TValue);
    invert(): KeyValuePair<TValue, TKey>;
    get key(): TKey;
    private __key;
    get value(): TValue;
    private __value;
}
