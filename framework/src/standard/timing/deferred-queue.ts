import { StringUtils } from "../../core-base/utils/index.js";
import { assert } from "../../validation/index.js";
import { ArgumentOutOfRangeException } from "../exceptions/index.js";
import { Method } from "../reflection/types.js";
import { DeferredQueueItem, Timer } from "./index.js";

export class DeferredQueue<TArgs extends any[] = [], TResult = void> {
    constructor() {
        this.#timer.ElapsedEvent.attach(this.#timer_onElapsed);
    }

    #timer_onElapsed = () => {
        this.#processAsync();
    }

    async #processAsync() {
        for (let item of this.#items)
            await item._executeAsync();

        this.#clearItems();
    }

    #clearItems() {
        this.#items.splice(0, this.#items.length);
    }

    enqueue(callback: Method<TArgs, TResult>, ...args: TArgs): DeferredQueueItem<TArgs, TResult> {
        assert({ callback }, [Function]);

        return this.#doEnqueue(callback, args);
    }

    #doEnqueue(callback: Method<TArgs, TResult>, args: TArgs): DeferredQueueItem<TArgs, TResult> {
        const item = new DeferredQueueItem(callback, args);
        this.#items.push(item);

        this.#resetTimer();

        return item;
    }

    dequeue(item: DeferredQueueItem<TArgs, TResult>): void {
        assert({ item }, [DeferredQueueItem]);

        if (!this.#items.includes(item))
            throw new ArgumentOutOfRangeException(StringUtils.nameOf({ item }));

        this.#doDequeue(item);
    }

    #doDequeue(item: DeferredQueueItem<TArgs, TResult>): void {
        item._abort();

        this.#removeItem(item);
        
        this.#resetTimer();
    }

    #removeItem(item: DeferredQueueItem<TArgs, TResult>) {
        this.#items.splice(this.#items.indexOf(item), 1);
    }

    #resetTimer() {
        this.#timer.isEnabled = false;
        this.#timer.isEnabled = true;
    }

    #items: DeferredQueueItem<TArgs, TResult>[] = [];

    #timer: Timer = new Timer();
}