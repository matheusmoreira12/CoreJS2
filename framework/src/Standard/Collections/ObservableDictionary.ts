import { Dictionary } from "./Dictionary";
import { Enumeration } from "../Enumeration";
import { FrameworkEvent } from "../Events/FrameworkEvent";

export type ObservableDictionaryChangeArgs<TKey, TValue> = {
    action: number,
    key: TKey | null,
    oldValue: TValue | null,
    newValue: TValue | null
};

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
        const valueHasChanged = this.has(key);
        if (valueHasChanged) {
            const oldValue = this.get(key);
            this.ChangeEvent.invoke(this, {
                action: ObservableDictionaryChangeAction.Change,
                key,
                oldValue: null,
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
