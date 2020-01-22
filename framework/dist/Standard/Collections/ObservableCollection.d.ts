import { Collection } from "./index.js";
import { Enumeration } from "../index.js";
import { FrameworkEvent } from "../Events/index.js";
export declare type ObservableCollectionChangeArgs<T> = {
    action: number;
    oldItems: T[];
    oldIndex: number;
    newItems: T[];
    newIndex: number;
};
export declare const ObservableCollectionChangeAction: Enumeration;
export declare class ObservableCollection<T> extends Collection<T> {
    __notifySplice(start: number, deleteCount: number, ...items: T[]): void;
    __notifyPush(...items: T[]): void;
    __notifyPop(): void;
    splice(start: number, deleteCount: number, ...items: T[]): T[];
    push(...items: T[]): number;
    pop(): T | undefined;
    get ChangeEvent(): FrameworkEvent;
    __ChangeEvent: FrameworkEvent<import("../Events/Events.js").FrameworkEventArgs>;
}
