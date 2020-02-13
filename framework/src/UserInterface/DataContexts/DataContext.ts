import { TreeItem } from "../../Standard/Collections/index";
import { assertParams, assert } from "../../Validation/index";
import { InvalidOperationException } from "../../Standard/index";

export class DataContext extends TreeItem<DataContext> {
    /**
     * Gets the main data context.
     */
    static get main() { return mainContext; }

    /**
     * Finds the nearest data context to the specified target, or null if there's none.
     * @param target The target object of the desired context.
     */
    static findNearest(target: object): DataContext | null {
        assertParams({ target }, Object);

        return findNearestDataContextByTarget(target);
    }

    /**
     * Finds the data context exactly matching the specified target, or null if there's none.
     * @param target The target object of the desired context.
     */
    static find(target: object): DataContext | null {
        assertParams({ target }, Object);

        return findDataContextByTarget(target);
    }

    /**
     * Finds the context for the specified target and, if there's none, creates one under the main context. 
     * @param target The target object for the desired context.
     */
    static get(target: object): DataContext {
        assertParams({ target }, Object);

        const context = findDataContextByTarget(target);
        if (context === null)
            return createContextForTarget(target);
        else
            return context;
    }

    /**
     * Finds the nearest parent context and overrides from it. If a context for the specified target already exists, returns the existing context.
     * @param target The target object for the desired context.
     */
    static override(target: object): DataContext {
        assertParams({ target }, Object);

        return overrideContextByTarget(target);
    }

    constructor(target: object | null, ...children: DataContext[]) {
        assertParams({ target }, Object, null);

        super(...children);
        this.target = target;
    }

    target: object | null;
}

function createContextForTarget(target: object): DataContext {
    const context = new DataContext(target);
    mainContext.children.add(context);
    return context;
}

function findDataContextByTarget(target: object): DataContext | null {
    return mainContext.find(c => c.target === target);
}

function findNearestInstanceDataContext(target: object): DataContext | null {
    while (target) {
        const context = findDataContextByTarget(target);
        if (context !== null)
            return context;
        target = Object.getPrototypeOf(target);
    }
    return null;
}

function findNearestConstructorDataContext(target: object): DataContext | null {
    let targetCtor = target.constructor;
    while (targetCtor) {
        const context = findDataContextByTarget(targetCtor);
        if (context !== null)
            return context;
        targetCtor = Object.getPrototypeOf(targetCtor);
    }
    return null;
}

function findNearestDataContextByTarget(target: object): DataContext | null {
    return findNearestInstanceDataContext(target) || findNearestConstructorDataContext(target) || null;
}

function overrideContextByTarget(target: object): DataContext {
    const context = findDataContextByTarget(target);
    if (context === null) {
        const oldContext = findNearestDataContextByTarget(target);
        if (oldContext === null)
            throw new InvalidOperationException("Cannot override data context. No context was found to override from.");
        else {
            const newContext = new DataContext(target);
            oldContext.children.add(newContext);
            return newContext;
        }
    }
    else
        return context;
}

const mainContext = new DataContext(null);