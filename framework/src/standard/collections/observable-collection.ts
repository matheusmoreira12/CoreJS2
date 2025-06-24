import { Collection } from "./collection.js";
import { Enumeration } from "../enumerations/enumeration.js";
import { FrameworkEvent } from "../events/framework-event.js";
import { FrameworkEventArgs } from "../events/index.js";

export class ObservableCollectionChangeArgs<T> extends FrameworkEventArgs {
    constructor(action: number, oldIndex: number, oldItems: T[] | null, newIndex: number, newItems: T[] | null) {
        super();

        this.__action = action;
        this.__oldIndex = oldIndex;
        this.__oldItems = oldItems;
        this.__newIndex = newIndex;
        this.__newItems = newItems;
    }

    get action(): number { return this.__action; }
    private __action: number;

    get oldIndex(): number { return this.__oldIndex; }
    private __oldIndex: number;

    get oldItems(): T[] | null { return this.__oldItems; }
    private __oldItems: T[] | null;

    get newIndex(): number { return this.__newIndex; }
    private __newIndex: number;

    get newItems(): T[] | null { return this.__newItems; }
    private __newItems: T[] | null;
};

export const ObservableCollectionChangeAction = Enumeration.create({
    Add: 1,
    Remove: 2,
    Move: 4,
    Modify: 8,
    Sort: 24,
    Reverse: 40,
} as const);

/*
 * ObservableCollection class
 * Creates a collection observable via the "change" event.
 */
export class ObservableCollection<T> extends Collection<T> {
    #notifyFill(oldItems: T[], start?: number, end?: number): void {
        const newItems = this.slice(start, end);
        const index = start ?? 0;
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Modify, index, oldItems, index, newItems))
    }

    #notifyPop(oldLength: number, oldItem: T | undefined): void {
        const oldIndex = oldLength - 1;
        const oldItems = oldItem === undefined ? [] : [oldItem];
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Remove, oldIndex, oldItems, -1, null));
    }

    #notifyPush(oldLength: number, newItems: T[]): void {
        const newIndex = oldLength - 1;
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Add, -1, null, newIndex, newItems));
    }

    #notifyReverse(oldItems: T[]) {
        const newItems = this.slice();
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Reverse, 0, oldItems, 0, newItems));
    }

    #notifySplice(start: number, deleteCount: number, oldItems: T[], newItems: T[]): void {
        const itemsWereRemoved = deleteCount > 0,
            itemsWereAdded = newItems.length > 0;
        if (!itemsWereRemoved && !itemsWereAdded)
            return;

        const action = (itemsWereAdded ? ObservableCollectionChangeAction.Add : 0) |
            (itemsWereRemoved ? ObservableCollectionChangeAction.Remove : 0);
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(action, start, oldItems, start, newItems));
    }

    #notifyShift(removedItem: T | undefined) {
        if (removedItem == undefined)
            return;

        const movedItems = this.slice();
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Remove, 0, [removedItem], -1, null));
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Move, 0, movedItems, 1, null));
    }


    fill(value: T, start?: number, end?: number): this {
        const oldItems = this.slice(start, end);
        super.fill(value, start, end);
        this.#notifyFill(oldItems, start, end);
        return this;
    }

    pop(): T | undefined {
        const oldLength = this.length;
        const oldItem = super.pop();
        this.#notifyPop(oldLength, oldItem);
        return oldItem;
    }

    push(...items: T[]): number {
        const oldLength = this.length;
        const newLength = super.push(...items);
        this.#notifyPush(oldLength, items);
        return newLength;
    }

    reverse(): T[] {
        const oldCopy = this.slice();
        const newItems = super.reverse();
        this.#notifyReverse(oldCopy);
        return newItems;
    }

    shift(): T | undefined {
        const removedItem = super.shift();
        this.#notifyShift(removedItem);
        return removedItem;
    }

    splice(start: number, deleteCount: number, ...items: T[]) {
        const oldItems = super.splice(start, deleteCount, ...items);
        this.#notifySplice(start, deleteCount, oldItems, items);
        return oldItems;
    }

    sort(compareFn?: (a: T, b: T) => number): this {
    }

    get ChangeEvent(): FrameworkEvent<ObservableCollectionChangeArgs<T>> { return this.__ChangeEvent; }
    __ChangeEvent = new FrameworkEvent<ObservableCollectionChangeArgs<T>>();
}
