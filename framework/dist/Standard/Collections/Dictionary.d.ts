import { Collection, KeyValuePair } from "./index.js";
/**
 * Dictionary class
 *
 */
export declare class Dictionary<TKey, TValue> extends Collection<KeyValuePair<TKey, TValue>> {
    static fromMap<TKey, TValue>(map: Map<TKey, TValue>): Dictionary<TKey, TValue>;
    static fromKeyValueObject(obj: {
        [key: string]: any;
    }): Dictionary<string, any>;
    get(key: TKey): TValue | undefined;
    has(key: TKey): boolean;
    set(key: TKey, value: TValue): void;
    getKeys(): Generator<TKey>;
    getValues(): Generator<TValue>;
    invert(): Dictionary<TValue, TKey>;
    delete(key: TKey): void;
}
