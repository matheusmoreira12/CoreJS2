import { FrameworkEventArgs } from "../Standard/Events/index.js";
import { assertParams } from "../ValidationStandalone/index.js";
import { Ajax } from "./index.js";

const $target = Symbol("target");

export class AjaxEventArgs extends FrameworkEventArgs {
    constructor(target: Ajax) {
        assertParams({ target }, [Ajax]);

        super();

        this[$target] = target;
    }

    get target(): Ajax { return this[$target]; }
    private [$target]: Ajax;
}