import { FrameworkEventArgs } from "../../Standard/Events/index.js"
import { MarkupAttribute } from "./MarkupAttribute.js";
import { AttributesChangeAction } from "./AttributesChangeAction.js";
import { assertEachParams } from "../../Validation/index.js";
import { assertParams } from "../../ValidationStandalone/index.js";

const $action = Symbol("action");
const $oldAttributes = Symbol("oldAttributes");
const $newAttributes = Symbol("newAttributes");

export class AttributesChangeEventArgs extends FrameworkEventArgs {
    constructor(action: number, oldAttributes: MarkupAttribute[], newAttributes: MarkupAttribute[]) {
        super();

        assertParams({ action }, [Number]);
        assertEachParams({ oldAttributes }, [MarkupAttribute]);
        assertEachParams({ newAttributes }, [MarkupAttribute]);
        AttributesChangeAction.assertFlag(action);

        this[$action] = action;
        this[$oldAttributes] = oldAttributes;
        this[$newAttributes] = newAttributes;
    }

    get action(): number { return this[$action]; }
    private [$action]: number;

    get oldAttributes(): MarkupAttribute[] { return this[$oldAttributes]; }
    private [$oldAttributes]: MarkupAttribute[];

    get newAttributes(): MarkupAttribute[] { return this[$newAttributes]; }
    private [$newAttributes]: MarkupAttribute[];
}