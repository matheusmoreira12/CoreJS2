import { Collection } from "./Collection";
import { Enumeration } from "../Enumeration";
import { FrameworkEvent } from "../Events/FrameworkEvent";
import { FrameworkEventArgs } from "../Events/index";

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

    get oldIndex(): number { return this[$action]; }
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
    __notifySplice(start: number, deleteCount: number, ...items: T[]) {
        let action = (items.length > 0 ? ObservableCollectionChangeAction.Add : 0) |
            (deleteCount > 0 ? ObservableCollectionChangeAction.Remove : 0);
        if (action === 0)
            return;
        const oldItems = Array.from(this.getRange(start, deleteCount));
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(action, oldItems, start, items, start));
    }
    __notifyPush(...items: T[]) {
        const newIndex = this.length - 1;
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Add, [], -1, items, newIndex));
    }
    __notifyPop() {
        const oldIndex = this.length - 1, 
            oldItems = [this.last];
        this.ChangeEvent.invoke(this, new ObservableCollectionChangeArgs(ObservableCollectionChangeAction.Remove, oldItems, oldIndex, [], -1));
    }
    splice(start: number, deleteCount: number, ...items: T[]) {
        this.__notifySplice(start, deleteCount, ...items);
        return super.splice(start, deleteCount, ...items);
    }
    push(...items: T[]): number {
        this.__notifyPush(...items);
        return super.push(...items);
    }
    pop(): T | undefined {
        this.__notifyPop();
        return super.pop();
    }
    get ChangeEvent(): FrameworkEvent<ObservableCollectionChangeArgs<T>> { return this.__ChangeEvent; }
    __ChangeEvent = new FrameworkEvent<ObservableCollectionChangeArgs<T>>();
}
