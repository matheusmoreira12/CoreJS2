import { assertParams } from "../../validation/index.js";
import { FrameworkException } from "../exceptions/index.js";

class ReadOnlySpanIterator<T> implements Iterator<T> {
    #originIterator: Iterator<T>;
    #currentIndex: number;
    #endIndex: number;

    constructor(originIterator: Iterator<T>, startIndex: number, endIndex: number) {
        this.#originIterator = originIterator;
        this.#currentIndex = startIndex;
        this.#endIndex = endIndex;

        this.#advanceSourceToStart(startIndex);
    }

    #advanceSourceToStart(startIndex: number) {
        let result = null;
        let index = 0;
        while ((result === null || !result.done) && index < startIndex) {
            result = this.#originIterator.next();
            index++;
        }
    }

    next(): IteratorResult<T> {
        if (this.#currentIndex > this.#endIndex)
            return { done: true, value: undefined };

        this.#currentIndex++;
        return this.#originIterator.next();
    }
}

export class ReadOnlySpan<T> implements Iterable<T> {
    #originArray!: T[];
    #startIndex!: number;
    #endIndex!: number;

    [Symbol.iterator](): Iterator<T, any, undefined> {
        return new ReadOnlySpanIterator(this.#originArray.values(), this.#startIndex, this.#endIndex);
    }

    constructor(reference: T);
    constructor(array?: T[]);
    constructor(array: T[], start: number, end: number);
    constructor(...args: [T] | [T[]?] | [T[], number, number]) {
        if (args.length == 1) {
            this.#startIndex = 0;

            if (args[0] instanceof Array)
                this.#__constructor_ovld0(args[0]);
            else
                this.#__constructor_ovld1(args[0] as T);
        }
        if (args.length == 3) {
            this.#__constructor_ovld2(args[0], args[1], args[2]);
        }
        else
            throw new FrameworkException(`No overload takes ${args.length} arguments.`);
    }

    #__constructor_ovld0(array: T[]) {
        this.#originArray = array;
        this.#startIndex = 0;
        this.#endIndex = array.length - 1;
    }

    #__constructor_ovld1(reference: T) {
        this.#originArray = [reference];
        this.#startIndex = 0;
        this.#endIndex = 0;
    }

    #__constructor_ovld2(array: T[], start: number, end: number) {
        assertParams({ array }, [Array]);
        assertParams({ start, end }, [Number]);

        this.#originArray = array;
        this.#startIndex = start;
        this.#endIndex = end
    }
}