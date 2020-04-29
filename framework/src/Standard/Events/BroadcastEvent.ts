import { FrameworkEvent, FrameworkEventListener, FrameworkEventArgs } from "./index.js";
import { ArgumentTypeException } from "../Exceptions/index.js"
import { Collection } from "../Collections/index.js";

/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export class BroadcastEvent<TArgs extends FrameworkEventArgs> extends FrameworkEvent<TArgs> {
    private static __EventBroadcastEvent: FrameworkEvent<any> = new FrameworkEvent();

    constructor(name: string, defaultListener?: FrameworkEventListener<TArgs>, defaultListenerThisArg?: any) {
        super(defaultListener, defaultListenerThisArg);

        this.__name = name;

        BroadcastEvent.__EventBroadcastEvent.attach(this.__onEventBroadcast, this);
    }

    __onEventBroadcast(sender: any, args: any) {
        if (args.senderEventName === this.name)
            this.invoke(sender, args.originalArgs);
    }

    __onRoutedEvent(sender: any, args: TArgs) {
        this.broadcast(sender, args);
    }

    broadcast(sender: any, args: TArgs) {
        super.invoke(sender, args);

        BroadcastEvent.__EventBroadcastEvent.invoke(sender, {
            originalArgs: args,
            senderEventName: this.__name
        });
    }

    route(baseEvent: FrameworkEvent<TArgs>) {
        if (!(baseEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("baseEvent");

        if (this.__routedEvents.indexOf(baseEvent) !== -1)
            return false;

        baseEvent.attach(this.__onRoutedEvent, this);
        this.__routedEvents.add(baseEvent);
        return true;
    }

    unroute(baseEvent: FrameworkEvent<TArgs>) {
        if (!(baseEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("baseEvent");

        if (this.__routedEvents.indexOf(baseEvent) == -1)
            return false;

        baseEvent.detach(this.__onRoutedEvent);
        this.__routedEvents.remove(baseEvent);
        return true;
    }

    unrouteAll() {
        for (let routedEvent of this.__routedEvents)
            this.unroute(routedEvent);
    }

    private __routedEvents: Collection<FrameworkEvent<TArgs>> = new Collection();

    get name(): string { return this.__name; }
    private __name: string;

    destrutor() {
        BroadcastEvent.__EventBroadcastEvent.detach(this.__onEventBroadcast);

        super.destructor();
    }
}