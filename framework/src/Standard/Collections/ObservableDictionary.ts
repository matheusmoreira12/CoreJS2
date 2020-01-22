import { Dictionary } from "./index.js";
import { Enumeration } from "../index.js";
import { FrameworkEvent } from "../Events/index.js";

export type ObservableDictionaryChangeArgs<TKey, TValue> = { action: number, key: TKey, oldValue: TValue, newValue: TValue };

export const ObservableDictionaryChangeAction = new Enumeration([
    "Add",
    "Change",
    "Delete"
]);

/*
 * ObservableDictionary class
 * Creates a dictionary observable via the "change" event.
 */
export class ObservableDictionary<TKey, TValue> extends Dictionary<TKey, TValue> {
    private __notifySet(key: TKey, value: TValue) {
        if (this.has(key)) {
            let oldValue = this.get(key);

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
                oldValue: undefined,
                newValue: value
            });
    }

    private __notifyDelete(key: TKey) {
        if (!this.has(key)) return;

        let oldValue = this.get(key);

        this.ChangeEvent.invoke(this, {
            action: ObservableDictionaryChangeAction.Delete,
            key,
            oldValue,
            newValue: undefined
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

    get ChangeEvent() { return this.__ChangeEvent; }
    __ChangeEvent = new FrameworkEvent();
}
