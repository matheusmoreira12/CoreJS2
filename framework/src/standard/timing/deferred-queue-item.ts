import { assert } from "../../validation/index.js";
import { Method } from "../reflection/types";


export class DeferredQueueItem<TArgs extends any[] = [], TResult = void> extends Promise<TResult> {
    constructor(callback: Method<TArgs, TResult>, args: TArgs) {
        assert({ callback }, [Function]);
        assert({ args }, [Array]);

        let res: (value: TResult) => void;
        let rej: (reason: null) => void;
        super((resolve, reject) => {
            res = resolve;
            rej = reject;
        });

        this.#resolve = res!;
        this.#reject = rej!;
        this.#callback = callback;
        this.#args = args;
    }

    _execute() {
        const result = this.#callback.apply(undefined, this.#args);
        this.#resolve(result);
    }

    _abort() {
        this.#reject(null);
    }

    #callback: Method<TArgs, TResult, undefined>;

    #args: TArgs;

    #resolve: (value: TResult) => void;
    #reject: (reason: null) => void;
}
