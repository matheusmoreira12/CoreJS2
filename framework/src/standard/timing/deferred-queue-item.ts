import { assert } from "../../validation/index.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { Method } from "../reflection/types.js";


export class DeferredQueueItem<TArgs extends any[] = [], TResult = void> {
    constructor(callback: Method<TArgs, TResult>, args: TArgs) {
        assert({ callback }, [Function]);
        assert({ args }, [Array]);

        this.#callback = callback;
        this.#args = args;

        let _resolve: (value: TResult) => void;
        let _reject: (reason: null) => void;
        this.#promise = new Promise((resolve, reject) => {
            _resolve = resolve;
            _reject = reject;
        });
        this.#promise_resolve = _resolve!;
        this.#promise_reject = _reject!;
    }

    async _executeAsync() {
        this.#isExecuting = true;

        const result = await this.#callback.apply(undefined, this.#args);
        this.#promise_resolve(result);

        this.#isExecuting = false;
    }

    _abort() {
        if (this.#isExecuting)
            throw new InvalidOperationException("Cannot abort queue item. Item is already in execution.");

        this.#promise_reject(null);
    }

    get done(): Promise<TResult> { return this.#promise; }

    #callback: Method<TArgs, TResult, undefined>;

    #args: TArgs;

    #promise: Promise<TResult>;
    #promise_resolve: (value: TResult) => void;
    #promise_reject: (reason: null) => void;

    #isExecuting: boolean = false;
}
