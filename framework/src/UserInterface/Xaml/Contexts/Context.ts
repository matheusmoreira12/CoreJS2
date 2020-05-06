import { TreeItem } from "../../../Standard/Collections/index.js";
import { assertParams, assertEachParams, TypeValidationMode } from "../../../Validation/index.js";
import { InvalidOperationException } from "../../../Standard/Exceptions/index.js"

//Keys for DataContext

/**
 * Holds context information for data transactions.
 */
export class Context extends TreeItem<Context> {
    static get root() { return mainContext; }

    constructor(target: object | null, ...children: Context[]) {
        assertEachParams({ children }, [Context], TypeValidationMode.MatchAny, [Array]);

        super(...children)

        this.__target = target;
    }

    get target(): object | null { return this.__target; }
    private __target: object | null;
}

const mainContext = new Context(null);