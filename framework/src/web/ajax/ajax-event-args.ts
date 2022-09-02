import { FrameworkEventArgs } from "../../standard/events/index.js";
import { assertParams } from "../../validation-standalone/index.js";
import { Ajax } from "./index.js";

export class AjaxEventArgs extends FrameworkEventArgs {
    constructor(target: Ajax) {
        assertParams({ target }, [Ajax]);

        super();

        this.__target = target;
    }

    get target(): Ajax { return this.__target; }
    private __target: Ajax;
}