import { TreeItem } from "../../Standard/Collections/index";
import { assertParams, assertEachParams } from "../../Validation/index";
import { InvalidOperationException } from "../../Standard/index";

//Keys for DataContext
const $target = Symbol();

/**
 * Holds context information for data transactions.
 */
export class DataContext extends TreeItem<DataContext> {
    static get root() { return mainContext; }

    constructor(target: object | null, ...children: DataContext[]) {
        assertEachParams({ children }, Array, DataContext);

        super(...children)

        this[$target] = target;
    }

    get target(): object | null { return this[$target]; }
    private [$target]: object | null;
}

const mainContext = new DataContext(null);