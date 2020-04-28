import { FrameworkEventArgs } from "./FrameworkEventArgs.js";

const $target = Symbol("target");
const $event = Symbol("event");

export class NativeEventArgs extends FrameworkEventArgs {
    constructor(target: any, event: Event) {
        super();

        this[$target] = target;
        this[$event] = event;

        Object.assign(this, event);
    }

    get target(): any { return this[$target]; }
    private [$target]: any;

    get event(): Event { return this[$event]; }
    private [$event]: Event;
}
