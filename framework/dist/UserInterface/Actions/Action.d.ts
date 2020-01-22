import { FrameworkEvent } from "../../Standard/Events/index.js";
import { Dictionary } from "../../Standard/Collections/index.js";
/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export declare abstract class Action {
    constructor();
    execute(data?: Dictionary<string, any>): void;
    get ExecutedEvent(): FrameworkEvent<import("../../Standard/Events/Events.js").FrameworkEventArgs>;
    private __ExecutedEvent;
}
