import { FrameworkEventArgs } from "../../Standard/Events/index"
import { MarkupElement } from "./MarkupElement";
import { ChildrenChangeAction } from "./ChildrenChangeAction";
import { assertEachParams, assertParams } from "../../Validation/index";

const $action = Symbol("action")
const $oldChildren = Symbol("oldChildren")
const $newChildren = Symbol("newChildren")

export class ChildrenChangeEventArgs extends FrameworkEventArgs {
    constructor(action: number, oldIndex: number, oldChildren: MarkupElement[], newIndex: number, newChildren: MarkupElement[]) {
        super();

        ChildrenChangeAction.assertFlag(action);
        assertParams({ oldIndex }, [Number]);
        assertEachParams({ oldChildren }, [MarkupElement]);
        assertParams({ newIndex }, [Number]);
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