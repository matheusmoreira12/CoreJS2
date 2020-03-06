import { TreeItem } from "../../../Standard/Collections/index";
import { assertParams, assertEachParams } from "../../../Validation/index";
import { InvalidOperationException } from "../../../Standard/index";

//Keys for DataContext
const $target = Symbol();

/**
 * Holds context information for data transactions.
 */
export class Context extends TreeItem<Context> {
    static get root() { return mainContext; }

    constructor(target: object | null, ...children: Context[]) {
        assertEachParams({ children }, Array, Context);

        super(...children)

        this[$target] = target;
    }

    get target(): object | null { return this[$target]; }
    private [$target]: object | null;
}

const mainContext = new Context(null);