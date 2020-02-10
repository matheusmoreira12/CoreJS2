import { Dictionary } from "./Dictionary";
import { Enumeration } from "../Enumeration";
import { FrameworkEvent } from "../Events/FrameworkEvent";
import { FrameworkEventArgs } from "../Events/index";

const $action = Symbol();
const $key = Symbol();
const $oldValue = Symbol();
const $newValue = Symbol();

export class ObservableDictionaryChangeArgs<TKey, TValue> extends FrameworkEventArgs {
    constructor(action: number, key: TKey | null, oldValue: TValue | null, newValue: TValue | null) {
        super();

        this[$action] = action;
        this[$key] = key;
        this[$oldValue] = oldValue;
        this[$newValue] = newValue;
    }

    get action(): number { return this[$action]; }
    private [$action]: number;
    
    get key(): TKey | null { return this[$key]; }
    private [$key]: TKey | null;
    
    get oldValue(): TValue | null { return this[$oldValue]; }
    private [$oldValue]: TValue | null;
    
    get newValue(): TValue | null { return this[$newValue]; }
    private [$newValue]: TValue | null;
};

export const ObservableDictionaryChangeAction = Enumeration.create({
    Add: null,
    Change: null,
    Delete: null
});

/*
 * ObservableDictionary class
 * Creates a dictionary observable via the "change" event.
 */
export class ObservableDictionary<TKey, TValue> extends Dictionary<TKey, TValue> {
    private __notifySet(key: TKey, value: TValue) {
        const valueHasChanged = this.has(key);
        if (valueHasChanged) {
            const oldValue = this.get(key) || null;
            this.ChangeEvent.invoke(this, {
                action: ObservableDictionaryChangeAction.Change,
                key,
                oldValue,
                newValue: value,
            });
        }
        else
            this.ChangeEvent.invoke(this, {
                action: ObservableDictionaryChangeAction.Add,
                key,
                oldValue: null,
                newValue: value
            });
    }

    private __notifyDelete(key: TKey) {
        const oldValue = this.get(key) || null;
        this.ChangeEvent.invoke(this, {
            action: ObservableDictionaryChangeAction.Delete,
            key,
            oldValue: oldValue,
            newValue: null
        });
    }

    set(key: TKey, value: TValue) {
        this.__notifySet(key, value);

        super.set(key, value);
    }

    delete(key: TKey) {
        this.__notifyDelete(key);

        super.delete(key);
    }

    get ChangeEvent(): FrameworkEvent<ObservableDictionaryChangeArgs<TKey, TValue>> { return this.__ChangeEvent; }
    private __ChangeEvent: FrameworkEvent<ObservableDictionaryChangeArgs<TKey, TValue>> = new FrameworkEvent();
}
