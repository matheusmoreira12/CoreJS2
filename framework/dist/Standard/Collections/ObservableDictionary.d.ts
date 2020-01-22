import { Dictionary } from "./index.js";
import { Enumeration } from "../index.js";
import { FrameworkEvent } from "../Events/index.js";
export declare type ObservableDictionaryChangeArgs<TKey, TValue> = {
    action: number;
    key: TKey;
    oldValue: TValue;
    newValue: TValue;
};
export declare const ObservableDictionaryChangeAction: Enumeration;
export declare class ObservableDictionary<TKey, TValue> extends Dictionary<TKey, TValue> {
    private __notifySet;
    private __notifyDelete;
    set(key: TKey, value: TValue): void;
    delete(key: TKey): void;
    get ChangeEvent(): FrameworkEvent<import("../Events/Events.js").FrameworkEventArgs>;
    __ChangeEvent: FrameworkEvent<import("../Events/Events.js").FrameworkEventArgs>;
}
