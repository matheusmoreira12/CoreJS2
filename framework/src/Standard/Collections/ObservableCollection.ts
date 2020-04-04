import { Collection } from "./Collection.js";
import { Enumeration } from "../Enumeration.js";
import { FrameworkEvent } from "../Events/FrameworkEvent.js";
import { FrameworkEventArgs } from "../Events/index.js";

const $action = Symbol("action");
const $oldItems = Symbol("oldItems");
const $oldIndex = Symbol("oldIndex");
const $newItems = Symbol("newItems");
const $newIndex = Symbol("newIndex");

export class ObservableCollectionChangeArgs<T> extends FrameworkEventArgs {
    constructor(action: number, oldItems: T[], oldIndex: number, newItems: T[], newIndex: number) {
        super();

        this[$action] = action;
        this[$oldItems] = oldItems;
        this[$oldIndex] = oldIndex;
        this[$newItems] = newItems;
        this[$newIndex] = newIndex;
    }

    get action(): number { return this[$action]; }
    private [$action]: number;

    get oldItems(): T[] { return this[$oldItems]; }
    private [$oldItems]: T[];

    get oldIndex(): number { return this[$oldIndex]; }
    private [$oldIndex]: number;

    get newItems(): T[] { return this[$newItems]; }
    private [$newItems]: T[];

    get newIndex(): number { return this[$newIndex]; }
    private [$newIndex]: number;
};

export const ObservableCollectionChangeAction = Enumeration.create({
    Add: 1,
    Remove: 2
});

/*
 * ObservableCollection class
 * Creates a collection observable via the "change" event.
 */
export class ObservableCollection<T> extends Collection<T> {
    __notifySplice(start: number, deleteCount: number, oldItems: T[], newItems: T[]) {
        const itemsWereRemoved = deleteCount > 0,
            itemsWereAdded = newItems.length > 0;
        if (itemsWereRemoved || itemsWereAdded) {
            const action = (itemsWereAdded ? ObservableCollectionChangeAction.Add : 0) |
                (itemsWereRemoved ? ObservableCollectionChangeAction.Remove : 0);
            this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(action, oldItems, start, newItems, start));
        }
    }
    __notifyPush(newIndex: number, newItems: T[]) {
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Add, [], -1, newItems, newIndex));
    }
    __notifyPop(oldIndex: number, oldItem: T | undefined) {
        const oldItems = oldItem === undefined ? [] : [oldItem];
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Remove, oldItems, oldIndex, [], -1));
    }
    splice(start: number, deleteCount: number, ...items: T[]) {
        //Make "splice"
        const oldItems = super.splice(start, deleteCount, ...items);
        //Notify "splice"
        this.__notifySplice(start, deleteCount, oldItems, items);
        //Forward "result"
        return oldItems;
    }
    push(...items: T[]): number {
        //Get old index
        const oldIndex = this.length - 1;
        //Make "push"
        const newLength = super.push(...items);
        //Notify "push"
        this.__notifyPush(oldIndex, items);
        //Forward result
        return newLength;
    }
    pop(): T | undefined {
        //Get old index
        const oldIndex = this.length - 1;
        //Make "pop"
        const oldItem = super.pop();
        //Notify "pop"
        this.__notifyPop(oldIndex, oldItem);
        //Forward result
        return oldItem;
    }
    get ChangeEvent(): FrameworkEvent<ObservableCollectionChangeArgs<T>> { return this.__ChangeEvent; }
    __ChangeEvent = new FrameworkEvent<ObservableCollectionChangeArgs<T>>();
}
