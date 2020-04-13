import { FrameworkEventArgs } from "../../Standard/Events/index"
import { MarkupAttribute } from "./MarkupAttribute";
import { AttributesChangeAction } from "./AttributesChangeAction";
import { assertEachParams } from "../../Validation/index";

const $action = Symbol("action")
const $oldAttributes = Symbol("oldAttributes")
const $newAttributes = Symbol("newAttributes")

export class AttributesChangeEventArgs extends FrameworkEventArgs {
    constructor(action: number, oldAttributes: MarkupAttribute[], newAttributes: MarkupAttribute[]) {
        super();

        AttributesChangeAction.assertFlag(action);
        assertEachParams({ oldAttributes }, [MarkupAttribute]);
        assertEachParams({ newAttributes }, [MarkupAttribute]);

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