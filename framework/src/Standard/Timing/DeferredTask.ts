import { Destructible } from "../Destructible.js";
import { Method } from "../Types/Types.js";

//Keys for ImmediateTask
const $taskCallback = Symbol("taskCallback");
const $immediateHandle = Symbol("immediateHandle");
const $cancel = Symbol("cancel");

export class DeferredTask<TArg1 = never, TArg2 = never, TArg3 = never, TArg4 = never, TArg5 = never, TArg6 = never, TArg7 = never, TArg8 = never, TArg9 = never, TArg10 = never, TArg11 = never, TArg12 = never, TArg13 = never, TArg14 = never, TArg15 = never, TArg16 = never, TRest extends any[] = never[]> extends Destructible {

    constructor(taskCallback: Method<TArg1, TArg2, TArg3, TArg4, TArg5, TArg6, TArg7, TArg8, TArg9, TArg10, TArg11, TArg12, TArg13, TArg14, TArg15, TArg16, TRest, void, undefined>) {
        super();

        this[$taskCallback] = taskCallback;
    }

    trigger(arg1: TArg1, arg2: TArg2, arg3: TArg3, arg4: TArg4, arg5: TArg5, arg6: TArg6, arg7: TArg7, arg8: TArg8, arg9: TArg9, arg10: TArg10, arg11: TArg11, arg12: TArg12, arg13: TArg13, arg14: TArg14, arg15: TArg15, arg16: TArg16, ...rest: TRest): void;
    trigger(...args: any[]): void {
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