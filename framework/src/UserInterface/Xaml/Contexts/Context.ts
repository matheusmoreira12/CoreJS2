import { TreeItem } from "../../../Standard/Collections/index.js";
import { assertParams, assertEachParams, TypeValidationMode } from "../../../Validation/index.js";
import { InvalidOperationException } from "../../../Standard/Exceptions/index.js"

//Keys for DataContext
const $target = Symbol("target");

/**
 * Holds context information for data transactions.
 */
export class Context extends TreeItem<Context> {
    static get root() { return mainContext; }

    constructor(target: object | null, ...children: Context[]) {
        assertEachParams({ children }, [Context], TypeValidationMode.MatchAny, [Array]);

        super(...children)

        this[$target] = target;
    }

    get target(): object | null { return this[$target]; }
    private [$target]: object | null;
}

const mainContext = new Context(null);