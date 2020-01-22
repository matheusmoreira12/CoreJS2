/**
 * Collection Class
 * Represents a collection of values.
 */
export declare class Collection<T> extends Array<T> {
    constructor(length: number);
    constructor(...items: T[]);
    get first(): T;
    get last(): T;
    getRange(index: number, itemCount: number): Generator<T>;
    add(item: T): void;
    addMultiple(items: Iterable<T>): void;
    insert(index: number, item: T): void;
    insertMultiple(index: number, items: Iterable<T>): void;
    move(oldIndex: number, newIndex: number): void;
    swap(index1: number, index2: number): void;
    replace(oldItem: T, newItem: T): void;
    removeAt(index: number): T;
    remove(item: T): void;
}
