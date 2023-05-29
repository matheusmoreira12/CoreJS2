import { IdentifierGenerator } from "../../core-base/index.js";
import { StringUtils } from "../../core-base/utils/string-utils.js";
import { ArgumentOutOfRangeException } from "../exceptions/index.js";
import { Method } from "../reflection/types.js";
import { Timer } from "./index.js";

export class DeferredQueueItem<TArgs extends any[] = []> {
    constructor(callback: Method<TArgs>, args: TArgs) {
        this.#callback = callback;
        this.#args = args;
    }

    get callback(): Method<TArgs, void, undefined> { return this.#callback; }
    #callback: Method<TArgs, void, undefined>;

    get args(): TArgs { return this.#args; }
    #args: TArgs;
}

export class DeferredQueue<TArgs extends any[] = []> {
    constructor() {
        this.#timer.ElapsedEvent.attach(this.#timer_onElapsed);
    }

    #timer_onElapsed = () => {
        this.#process();
    }

    #process() {
        for (let [_id, item] of this.#items)
            item.callback.apply(undefined, item.args);

        this.#items.clear();
    }

    enqueue(callback: Method<TArgs>, args: TArgs): bigint {
        const id = this.#idGenerator.generate();
        const item = new DeferredQueueItem(callback, args);
        this.#items.set(id, item);

        this.#resetTimer();

        return id;
    }

    dequeue(id: bigint): void {
        if (!this.#items.has(id))
            throw new ArgumentOutOfRangeException(StringUtils.nameOf({ id }));

        this.#items.delete(id);

        this.#resetTimer();
    }

    #resetTimer() {
        this.#timer.isEnabled = false;
        this.#timer.isEnabled = true;
    }
    
    #idGenerator = new IdentifierGenerator();

    #items: Map<bigint, DeferredQueueItem<TArgs>> = new Map();

    #timer: Timer = new Timer();
}