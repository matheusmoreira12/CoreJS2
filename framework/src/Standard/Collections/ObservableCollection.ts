import { Collection } from "./index";
import { Enumeration } from "../index";
import { FrameworkEvent } from "../Events/index";

export type ObservableCollectionChangeArgs<T> = { action: number, oldItems: T[], oldIndex: number, newItems: T[], newIndex: number };

export const ObservableCollectionChangeAction = new Enumeration({ Add: 1, Remove: 2 });

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
        this.ChangeEvent.invoke(this, {
            action,
            oldIndex: start,
            oldItems,
            newIndex: start,
            newItems: items
        });
    }
    __notifyPush(...items: T[]) {
        const newIndex = this.length - 1;
        this.ChangeEvent.invoke(this, {
            action: ObservableCollectionChangeAction.Add,
            oldIndex: null,
            oldItems: [],
            newIndex,
            newItems: items
        });
    }
    __notifyPop() {
        const oldIndex = this.length - 1, oldItem = this.last;
        this.ChangeEvent.invoke(this, {
            action: ObservableCollectionChangeAction.Remove,
            oldIndex,
            oldItems: [oldItem],
            newIndex: null,
            newItems: []
        });
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
    get ChangeEvent(): FrameworkEvent { return this.__ChangeEvent; }
    __ChangeEvent = new FrameworkEvent();
}
