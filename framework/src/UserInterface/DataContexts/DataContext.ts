import { TreeItem } from "../../Standard/Collections/index";
import { assertParams } from "../../Validation/index";
import { InvalidOperationException } from "../../Standard/index";

//Keys for DataContext
const $target = Symbol();

/**
 * Holds context information for data transactions.
 */
export class DataContext extends TreeItem<DataContext> {
    /**
     * Gets the main data context.
     */
    static get main() { return mainContext; }

    /**
     * Finds the data context corresponding to the specified target, or null if there's none.
     * @param target The target object of the desired context.
     */
    static find(target: object): DataContext | null {
        assertParams({ target }, Object);

        return getDataContextByTarget(target);
    }

    constructor(target: object | null, ...children: DataContext[]) {
        assertParams({ target }, Object, null);

        super(...children);
        this[$target] = target;
    }

    get target(): object | null { return this[$target]; }
    private [$target]: object | null;
}

function createContextForTarget(target: object, contextConstructor: typeof DataContext): DataContext {
    const context = new contextConstructor(target);
    mainContext.children.add(context);
    return context;
}

function getDataContextByTarget(target: object): DataContext {
    const context = mainContext.find(c => c.target === target);
    if (context)
        return context;
    else
        return DataContext.main;
}

const mainContext = new DataContext(null);