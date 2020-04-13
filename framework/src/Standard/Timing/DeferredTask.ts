import { Destructible } from "../Destructible.js";
import { Method } from "../Types/Types.js";

//Keys for ImmediateTask
const $taskCallback = Symbol("taskCallback");
const $immediateHandle = Symbol("immediateHandle");
const $cancel = Symbol("cancel");

export class DeferredTask<TArgs extends any[] = undefined[]> extends Destructible {

    constructor(taskCallback: Method<TArgs, void, undefined>) {
        super();

        this[$taskCallback] = taskCallback;
    }

    trigger(...args: TArgs): void {
        this[$cancel]();

        this[$immediateHandle] = setTimeout(() => {
            this[$taskCallback](...args);
        }, 0);
    }

    [$cancel]() {
        if (this[$immediateHandle] != -1)
            clearTimeout(this[$immediateHandle]);
    }

    private [$taskCallback]: Function;
    private [$immediateHandle]: number = -1;

    destructor() {
        this[$cancel]();
    }
}