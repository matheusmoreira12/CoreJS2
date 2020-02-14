import { DataContext } from "../DataContexts/index";
import { DependencyObject } from "./DependencyObject";
import { DependencyProperty } from "./DependencyProperty";
import { Collection } from "../../Standard/Collections/index";

type StoredValue = {
    property: DependencyProperty;
    value: any;
}

const $storedValues = Symbol();

export class DependencyContext extends DataContext {
    constructor(target: typeof DependencyObject, ...children: (DependencyInstanceContext | DependencyInstanceContext)[]) {
        super(target, ...children);
    }
}

export class DependencyInstanceContext extends DataContext {
    constructor(target: DependencyObject) {
        super(target);

        this[$storedValues] = new Collection();
    }

    get storedValues(): Collection<StoredValue> { return this[$storedValues]; }
    private [$storedValues]: Collection<StoredValue>;
}