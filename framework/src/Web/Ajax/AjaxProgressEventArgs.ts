import { assertParams } from "../../ValidationStandalone/index.js";
import { Ajax, AjaxEventArgs } from "./index.js";

const $total = Symbol("total");
const $loaded = Symbol("loaded");

export class AjaxProgressEventArgs extends AjaxEventArgs {
    constructor(target: Ajax, total: number, loaded: number) {
        assertParams({ total }, [Number])
        assertParams({ loaded }, [Number])

        super(target);

        this[$total] = total;
        this[$loaded] = loaded;
    }

    get total() { return this[$total]; }
    private [$total]: number;

    get loaded() { return this[$loaded]; }
    private [$loaded]: number;

    get percent() { return this.loaded / this.total * 100; }
}