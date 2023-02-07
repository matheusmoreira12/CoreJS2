import { assert } from "../../validation/index.js";
import { Destructible } from "../destructible.js";
import { Method } from "../reflection/types.js";

export class DeferredTask<TArgs extends unknown[] = [], TResult extends unknown = void> extends Destructible {
    constructor(taskCallback: Method<TArgs, TResult>) {
        assert({ taskCallback }, [Function]);

        super();

        this.#taskCallback = taskCallback;
    }

    trigger(...args: TArgs): Promise<TResult> {
        this.abort();
        this.#isTriggered = true;
        this.#args = args;
        return new Promise((resolve, reject) => {
            this.#promiseResolve = resolve;
            this.#promiseReject = reject;
            this.#doTrigger();
        });
    }

    #doTrigger() {
        this.#immediateHandle = setTimeout(() => {
            const result = this.#taskCallback.apply(undefined, this.#args!);
            this.#promiseResolve!(result);
        }, 0);
    }

    abort() {
        if (!this.#isTriggered)
            return;
        this.#doAbort();
        this.#promiseReject = null;
        this.#promiseResolve = null;
        this.#args = null;
        this.#isTriggered = false;
    }

    #doAbort() {
        clearTimeout(this.#immediateHandle!);
        this.#promiseReject!(null);
    }

    #taskCallback: Method<TArgs, TResult>;
    #promiseReject: ((reason?: any) => void) | null = null;
    #promiseResolve: ((result: TResult | PromiseLike<TResult>) => void) | null = null;
    #args: TArgs | null = null;
    #immediateHandle: number | null = 0;

    get isTriggered() { return this.#isTriggered; }
    #isTriggered: boolean = false;

    protected override _destructor() {
        this.abort();
    }
}