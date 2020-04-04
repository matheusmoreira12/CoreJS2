import { Dictionary } from "./Dictionary.js";
import { Enumeration } from "../Enumeration.js";
import { FrameworkEvent } from "../Events/FrameworkEvent.js";
import { FrameworkEventArgs } from "../Events/index.js";

const $action = Symbol("action");
const $key = Symbol("key");
const $oldValue = Symbol("oldValue");
const $newValue = Symbol("newValue");

export class ObservableDictionaryChangeArgs<TKey, TValue> extends FrameworkEventArgs {
    constructor(action: number, key: TKey, oldValue: TValue | null, newValue: TValue | null) {
        super();

        this[$action] = action;
        this[$key] = key;
        this[$oldValue] = oldValue;
        this[$newValue] = newValue;
    }

    get action(): number { return this[$action]; }
    private [$action]: number;

    get key(): TKey { return this[$key]; }
    private [$key]: TKey;

    get oldValue(): TValue | null { return this[$oldValue]; }
    private [$oldValue]: TValue | null;

    get newValue(): TValue | null { return this[$newValue]; }
    private [$newValue]: TValue | null;
};

export const ObservableDictionaryChangeAction = Enumeration.create({
    Add: null,
    Modify: null,
    Delete: null
});

/*
 * ObservableDictionary class
 * Creates a dictionary observable via the "change" event.
 */
export class ObservableDictionary<TKey, TValue> extends Dictionary<TKey, TValue> {
    private __notifyModify(key: TKey, oldValue: TValue, newValue: TValue) {
        this.ChangeEvent.invoke(this, new ObservableDictionaryChangeArgs(ObservableDictionaryChangeAction.Modify, key, oldValue, newValue));
    }

    private __notifyAdd(key: TKey, newValue: TValue) {
        this.ChangeEvent.invoke(this, new ObservableDictionaryChangeArgs(ObservableDictionaryChangeAction.Add, key, null, newValue));
    }

    private __notifyDelete(key: TKey, oldValue: TValue) {
        this.ChangeEvent.invoke(this, new ObservableDictionaryChangeArgs(ObservableDictionaryChangeAction.Delete, key, oldValue, null));
    }

    set(key: TKey, value: TValue) {
        //Retrieve old value
        let oldValue: TValue | null = null;
        if (this.has(key))
            oldValue = this.get(key);
        //Make "set"
        super.set(key, value);
        //Notify "set"
        if (oldValue === null)
            this.__notifyAdd(key, value);
        else
            this.__notifyModify(key, oldValue, value);
    }

    delete(key: TKey) {
        //Retrieve old value
        const oldValue = this.get(key);
        //Make "delete" 
        super.delete(key);
        //Notify "delete"
        this.__notifyDelete(key, oldValue);
    }

    get ChangeEvent(): FrameworkEvent<ObservableDictionaryChangeArgs<TKey, TValue>> { return this.__ChangeEvent; }
    private __ChangeEvent: FrameworkEvent<ObservableDictionaryChangeArgs<TKey, TValue>> = new FrameworkEvent();
}
