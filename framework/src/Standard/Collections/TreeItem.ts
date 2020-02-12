import { ObservableCollection, ObservableCollectionChangeArgs, ObservableCollectionChangeAction } from "./ObservableCollection";
import { Enumeration } from "../index";

//Keys for TreeItem
const $children = Symbol();
const $parent = Symbol();
const $children_onChange = Symbol();

export class TreeItem<T extends TreeItem<T>> {
    constructor(...children: T[]) {
        this[$children] = new ObservableCollection(...children);
        this[$parent] = null;

        this.children.ChangeEvent.attach(this[$children_onChange], this);
    }

    allRecursive(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean {
        if (!this.children.every(callbackfn, thisArg))
            return false;

        for (let child of this.children)
            if (!child.children.every(callbackfn, thisArg))
                return false;

        return true;
    }

    anyRecursive(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean {
        if (this.children.some(callbackfn, thisArg))
            return true;

        for (let child of this.children)
            if (child.children.some(callbackfn, thisArg))
                return true;

        return false;
    }

    selectRecursive<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
        const result: U[] = [];

        result.push(...this.children.map(callbackfn, thisArg));

        for (let child of this.children)
            result.push(...child.children.map(callbackfn, thisArg));

        return result;
    }

    whereRecursive<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
    whereRecursive(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
    whereRecursive(callbackfn: any, thisArg?: any) {
        const result: T[] = [];

        result.push(...this.children.filter(callbackfn, thisArg));

        for (let child of this.children)
            result.push(...child.children.filter(callbackfn, thisArg));

        return result;
    }

    findRecursive<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | null;
    findRecursive(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | null;
    findRecursive(predicate: any, thisArg?: any) {
        let item: T | undefined = this.children.find(predicate, thisArg);
        if (item !== undefined)
            return item;
        else {
            for (let child of this.children) {
                item = child.children.find(predicate, thisArg);
                if (item !== undefined)
                    return item;
            }
            return null;
        }
    }

    /**
     * Gets the parents (in ascending order) of this TreeItem.
     * Note: this operation is recursive.
     */
    getParents(): TreeItem<T>[] {
        if (this.parent === null)
            return [];
        else
            return [this.parent, ...this.parent.getParents()];
    }

    get children(): ObservableCollection<T> { return this[$children]; }
    private [$children]: ObservableCollection<T>;

    get parent(): TreeItem<T> | null { return this[$parent]; }
    private [$parent]: TreeItem<T> | null;

    private [$children_onChange](sender: any, args: ObservableCollectionChangeArgs<T>) {
        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems)
                item[$parent] = null;
        }
        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action)) {
            for (let item of args.oldItems)
                item[$parent] = this;
        }
    }


}