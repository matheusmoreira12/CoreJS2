import { ObservableCollection, ObservableCollectionChangeArgs, ObservableCollectionChangeAction } from "./observable-collection.js";
import { Enumeration } from "../index.js";

export class TreeItem<T extends TreeItem<T>> {
    constructor(...children: T[]) {
        this.__children = new ObservableCollection(...children);
        this.__parent = null;

        this.children.ChangeEvent.attach(this.__children_onChange, this);
    }

    all(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean {
        if (!this.children.every(callbackfn, thisArg))
            return false;

        for (let child of this.children)
            if (!child.children.every(callbackfn, thisArg))
                return false;

        return true;
    }

    any(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean {
        if (this.children.some(callbackfn, thisArg))
            return true;

        for (let child of this.children)
            if (child.children.some(callbackfn, thisArg))
                return true;

        return false;
    }

    select<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
        const result: U[] = [];

        result.push(...this.children.map(callbackfn, thisArg));

        for (let child of this.children)
            result.push(...child.children.map(callbackfn, thisArg));

        return result;
    }

    where<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    where(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
    where(callbackfn: any, thisArg?: any) {
        const result: T[] = [];

        result.push(...this.children.filter(callbackfn, thisArg));

        for (let child of this.children)
            result.push(...child.children.filter(callbackfn, thisArg));

        return result;
    }

    find<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | null;
    find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | null;
    find(predicate: any, thisArg?: any) {
        const item = this.children.find(predicate, thisArg);
        if (item !== undefined)
            return item;
        else {
            for (let child of this.children) {
                const item = child.find(predicate, thisArg);
                if (item !== null)
                    return item;
            }
            return null;
        }
    }

    /**
     * Recursively gets the parents (in ascending order) of this TreeItem.
     */
    getParents(): TreeItem<T>[] {
        if (this.parent === null)
            return [];
        else
            return [this.parent, ...this.parent.getParents()];
    }

    /**
     * Recursively gets the whole tree of this TreeItem.
     */
    getTree(): TreeItem<T>[] {
        return [this, ...this.getParents()]
    }

    get children(): ObservableCollection<T> { return this.__children; }
    private __children: ObservableCollection<T>;

    get parent(): TreeItem<T> | null { return this.__parent; }
    private __parent: TreeItem<T> | null;

    private __children_onChange(_sender: any, args: ObservableCollectionChangeArgs<T>) {
        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems)
                item.__parent = null;
        }
        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action)) {
            for (let item of args.newItems)
                item.__parent = this;
        }
    }

}