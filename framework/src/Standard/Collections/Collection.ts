import { ArgumentOutOfRangeException, KeyNotFoundException } from "../index";

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

    *getRange(index: number, itemCount: number): Generator<T> {
        if (index < 0 || index >= this.length)
            throw new ArgumentOutOfRangeException("index");
        if (itemCount < 0 || index + itemCount > this.length)
            throw new ArgumentOutOfRangeException("itemCount");
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
        if (oldIndex < 0 || oldIndex >= this.length)
            throw new ArgumentOutOfRangeException("oldIndex");
        if (newIndex < 0 || newIndex >= this.length)
            throw new ArgumentOutOfRangeException("newIndex");
        let item = this.removeAt(oldIndex);
        if (newIndex > oldIndex)
            newIndex--; //Compensate for the item removal
        this.insert(newIndex, item);
    }

    swap(index1: number, index2: number): void {
        if (index1 < 0 || index1 >= this.length)
            throw new ArgumentOutOfRangeException("index1");
        if (index2 < 0 || index2 >= this.length)
            throw new ArgumentOutOfRangeException("index2");
        [this[index1], this[index2]] = [this[index2], this[index1]];
    }

    replace(oldItem: T, newItem: T): void {
        let index = this.indexOf(oldItem);
        if (index === -1)
            throw new KeyNotFoundException();
        this[index] = newItem;
    }

    removeAt(index: number): T {
        if (index < 0 || index >= this.length)
            throw new ArgumentOutOfRangeException("index");
        return this.splice(index, 1)[0];
    }

    remove(item: T): void {
        let index = this.indexOf(item);
        if (index === -1)
            throw new KeyNotFoundException();
        this.removeAt(index);
    }

    clear(): T[] {
        return this.splice(0, this.length);
    }

    findLast(predicate: (this: typeof thisArg, value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined {
        return this.reverse().find(predicate, thisArg);
    }

    findIndexOfLast(predicate: (this: typeof thisArg, value: T, index: number, obj: T[]) => unknown, thisArg?: any): number {
        return this.reverse().findIndex(predicate, thisArg);
    }
}
