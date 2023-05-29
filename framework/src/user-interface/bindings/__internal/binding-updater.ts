import { Collection } from "../../../standard/collections/index.js";
import { Destructible } from "../../../standard/index.js";
import { DeferredQueue } from "../../../standard/timing/deferred-queue.js";
import { Binding } from "../index.js";

export abstract class BindingUpdater extends Destructible {
    constructor(binding: Binding) {
        super();

        this.#binding = binding;

        BindingUpdater.__all.add(this);
    }

    get binding(): Binding { return this.#binding; }
    #binding: Binding;

    destructor() {
        BindingUpdater.__all.remove(this);
    }

    static __all: Collection<BindingUpdater> = new Collection();

    static __updateQueue: DeferredQueue = new DeferredQueue();
}