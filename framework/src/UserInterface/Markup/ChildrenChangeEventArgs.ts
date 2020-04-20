import { FrameworkEventArgs } from "../../Standard/Events/index"
import { MarkupElement } from "./MarkupElement";
import { ChildrenChangeAction } from "./ChildrenChangeAction";
import { assertEachParams, assertParams } from "../../Validation/index";

const $action = Symbol("action");
const $oldChildren = Symbol("oldChildren");
const $oldIndex = Symbol("oldIndex");
const $newChildren = Symbol("newChildren");
const $newIndex = Symbol("newIndex");

export class ChildrenChangeEventArgs extends FrameworkEventArgs {
    constructor(action: number, oldIndex: number, oldChildren: MarkupElement[], newIndex: number, newChildren: MarkupElement[]) {
        super();

        ChildrenChangeAction.assertFlag(action);
        assertParams({ oldIndex }, [Number]);
        assertEachParams({ oldChildren }, [MarkupElement]);
        assertParams({ newIndex }, [Number]);
        assertEachParams({ newChildren }, [MarkupElement]);

        this[$action] = action;
        this[$oldIndex] = oldIndex;
        this[$oldChildren] = oldChildren;
        this[$newIndex] = newIndex;
        this[$newChildren] = newChildren;
    }

    get action(): number { return this[$action]; }
    private [$action]: number;

    get oldIndex(): number { return this[$oldIndex]; }
    private [$oldIndex]: number;

    get oldChildren(): MarkupElement[] { return this[$oldChildren]; }
    private [$oldChildren]: MarkupElement[];

    get newIndex(): number { return this[$newIndex]; }
    private [$newIndex]: number;

    get newChildren(): MarkupElement[] { return this[$newChildren]; }
    private [$newChildren]: MarkupElement[];
}