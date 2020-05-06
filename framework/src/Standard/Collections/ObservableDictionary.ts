import { Dictionary } from "./Dictionary.js";
import { Enumeration } from "../Enumeration.js";
import { FrameworkEvent } from "../Events/FrameworkEvent.js";
import { FrameworkEventArgs } from "../Events/index.js";


export class ObservableDictionaryChangeArgs<TKey, TValue> extends FrameworkEventArgs {
    constructor(action: number, key: TKey, oldValue: TValue | null, newValue: TValue | null) {
        super();

        this.__action = action;
        this.__key = key;
        this.__oldValue = oldValue;
        this.__newValue = newValue;
    }

    get action(): number { return this.__action; }
    private __action: number;

    get key(): TKey { return this.__key; }
    private __key: TKey;

    get oldValue(): TValue | null { return this.__oldValue; }
    private __oldValue: TValue | null;

    get newValue(): TValue | null { return this.__newValue; }
    private __newValue: TValue | null;
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
