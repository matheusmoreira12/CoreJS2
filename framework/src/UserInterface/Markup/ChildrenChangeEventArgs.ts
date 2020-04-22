import { FrameworkEventArgs } from "../../Standard/Events/index.js"
import { MarkupElement } from "./MarkupElement.js";
import { ChildrenChangeAction } from "./ChildrenChangeAction.js";
import { assertEachParams, assertParams } from "../../Validation/index.js";

const $action = Symbol("action");
const $oldChildren = Symbol("oldChildren");
const $oldIndex = Symbol("oldIndex");
const $newChildren = Symbol("newChildren");
const $newIndex = Symbol("newIndex");

export class ChildrenChangeEventArgs extends FrameworkEventArgs {
    constructor(action: number, oldIndex: number, oldChildren: MarkupElement[], newIndex: number, newChildren: MarkupElement[]) {
        super();

        assertParams({ action }, [Number]);
        assertParams({ oldIndex }, [Number]);
        assertEachParams({ oldChildren }, [MarkupElement]);
        assertParams({ newIndex }, [Number]);
        assertEachParams({ newChildren }, [MarkupElement]);
        ChildrenChangeAction.assertFlag(action);

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