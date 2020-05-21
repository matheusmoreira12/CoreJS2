import { FrameworkEventArgs } from "./FrameworkEventArgs.js";

export class NativeEventArgs extends FrameworkEventArgs {
    constructor(target: any, event: Event) {
        super();

        this.__target = target;
        this.__event = event;

        Object.assign(this, event);
    }

    get target(): any { return this.__target; }
    private __target: any;

    get event(): Event { return this.__event; }
    private __event: Event;
}
