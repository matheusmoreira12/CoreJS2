import { Destructible } from "../Destructible.js";
import { Method } from "../Types/Types.js";

export class DeferredTask<TArgs extends any[] = undefined[]> extends Destructible {

    constructor(taskCallback: Method<TArgs, void, undefined>) {
        super();

        this.__taskCallback = taskCallback;
    }

    trigger(...args: TArgs): void {
        this.__cancel();

        this.__immediateHandle = setTimeout(() => {
            this.__taskCallback(...args);
        }, 0);
    }

    private __cancel() {
        if (this.__immediateHandle != -1)
            clearTimeout(this.__immediateHandle);
    }

    private __taskCallback: Function;
    private __immediateHandle: number = -1;

    destructor() {
        this.__cancel();
    }
}