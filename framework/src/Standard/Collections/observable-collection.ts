import { Collection } from "./collection.js";
import { Enumeration } from "../enumerations/enumeration.js";
import { FrameworkEvent } from "../events/framework-event.js";
import { FrameworkEventArgs } from "../events/index.js";

export class ObservableCollectionChangeArgs<T> extends FrameworkEventArgs {
    constructor(action: number, oldIndex: number, oldItems: T[], newIndex: number, newItems: T[]) {
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

    get oldItems(): T[] { return this.__oldItems; }
    private __oldItems: T[];

    get newIndex(): number { return this.__newIndex; }
    private __newIndex: number;

    get newItems(): T[] { return this.__newItems; }
    private __newItems: T[];
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
            this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(action, start, oldItems, start, newItems));
        }
    }
    __notifyPush(newIndex: number, newItems: T[]) {
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Add, -1, [], newIndex, newItems));
    }
    __notifyPop(oldIndex: number, oldItem: T | undefined) {
        const oldItems = oldItem === undefined ? [] : [oldItem];
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Remove, oldIndex, oldItems, -1, []));
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
