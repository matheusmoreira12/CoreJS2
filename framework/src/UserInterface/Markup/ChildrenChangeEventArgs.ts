import { FrameworkEventArgs } from "../../Standard/Events/index"
import { MarkupElement } from "./MarkupElement";
import { ChildrenChangeAction } from "./ChildrenChangeAction";
import { assertEachParams } from "../../Validation/index";

const $action = Symbol("action")
const $oldChildren = Symbol("oldChildren")
const $newChildren = Symbol("newChildren")

export class ChildrenChangeEventArgs extends FrameworkEventArgs {
    constructor(action: number, oldChildren: MarkupElement[], newChildren: MarkupElement[]) {
        super();

        ChildrenChangeAction.assertFlag(action);
        assertEachParams({ oldChildren }, [MarkupElement]);
        assertEachParams({ newChildren }, [MarkupElement]);

        this[$action] = action;
        this[$oldChildren] = oldChildren;
        this[$newChildren] = newChildren;
    }

    get action(): number { return this[$action]; }
    private [$action]: number;

    get oldChildren(): MarkupElement[] { return this[$oldChildren]; }
    private [$oldChildren]: MarkupElement[];

    get newChildren(): MarkupElement[] { return this[$newChildren]; }
    private [$newChildren]: MarkupElement[];
}