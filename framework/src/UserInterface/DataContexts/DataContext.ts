import { TreeItem } from "../../Standard/Collections/index";
import { assertParams } from "../../Validation/index";
import { InvalidOperationException } from "../../Standard/index";

export class DataContext extends TreeItem<DataContext> {
    static get main() { return mainContext; }

    static getNearestByTarget(target: object): DataContext | null {
        assertParams({ target }, Object);

        return getNearestDataContextByTarget(target);
    }

    static getByTarget(target: object): DataContext | null {
        assertParams({ target }, Object);

        return getDataContextByTarget(target);
    }

    static overrideByTarget(target: object): DataContext {
        assertParams({ target }, Object);

        return overrideContextByTarget(target);
    }

    constructor(target: object | null, ...children: DataContext[]) {
        super(...children);
        this.target = target;
    }

    target: object | null;
}

function getDataContextByTarget(target: object) {
    return mainContext.find(c => c.target === target);
}

function getNearestInstanceDataContext(target: object): DataContext | null {
    while (target) {
        const context = getDataContextByTarget(target);
        if (context !== null)
            return context;
        target = Object.getPrototypeOf(target);
    }
    return null;
}

function getNearestConstructorDataContext(target: object): DataContext | null {
    let targetCtor = target.constructor;
    while (targetCtor) {
        const context = getDataContextByTarget(targetCtor);
        if (context !== null)
            return context;
        targetCtor = Object.getPrototypeOf(targetCtor);
    }
    return null;
}

function getNearestDataContextByTarget(target: object): DataContext | null {
    return getNearestInstanceDataContext(target) || getNearestConstructorDataContext(target) || null;
}

function overrideContextByTarget(target: object): DataContext {
    const oldContext = getNearestDataContextByTarget(target);
    if (oldContext === null)
        throw new InvalidOperationException("Cannot override data context. No context was found to override from.");
    else {
        const newContext = new DataContext(target);
        oldContext.children.add(newContext);
        return newContext;
    }
}

const mainContext = new DataContext(null);