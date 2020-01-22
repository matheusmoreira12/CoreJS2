import { FrameworkEvent } from "../../Standard/Events/index.js";
import { Trigger } from "./index.js";
import { Collection, Dictionary } from "../../Standard/Collections/index.js";
import { Action } from "../Actions/index.js";
/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export declare class EventTrigger extends Trigger {
    constructor(targetEvent: FrameworkEvent, ...actions: Action[]);
    private __targetEvent_handler;
    protected __executeActions(data?: Dictionary<string, any>): void;
    get targetEvent(): FrameworkEvent;
    private __targetEvent;
    get actions(): Collection<Action>;
    private __actions;
}
