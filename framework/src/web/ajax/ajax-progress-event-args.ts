import { assertParams } from "../../validation-standalone/index.js";
import { Ajax, AjaxEventArgs } from "./index.js";

export class AjaxProgressEventArgs extends AjaxEventArgs {
    constructor(target: Ajax, total: number, loaded: number) {
        assertParams({ total }, [Number])
        assertParams({ loaded }, [Number])

        super(target);

        this.__total = total;
        this.__loaded = loaded;
    }

    get total() { return this.__total; }
    private __total: number;

    get loaded() { return this.__loaded; }
    private __loaded: number;

    get percent() { return this.loaded / this.total * 100; }
}