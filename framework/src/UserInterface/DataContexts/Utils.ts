import { DataContext } from "./DataContext";
import { assertParams } from "../../Validation/index";

export const Utils = {
    getNearestByInstance(rootContext: DataContext, target: object): DataContext | null {
        assertParams({ rootContext }, DataContext);
        assertParams({ target }, Object);

        return getNearestContextByInstance(rootContext, target);
    },

    getNearestByConstructor(rootContext: DataContext, target: object): DataContext | null {
        assertParams({ rootContext }, DataContext);
        assertParams({ target }, Object);

        return getNearestContextByConstructor(rootContext, target);
    },

    getNearest(rootContext: DataContext, target: object): DataContext | null {
        assertParams({ rootContext }, DataContext);
        assertParams({ target }, Object);

        return getNearestContext(rootContext, target);
    }
};

function getNearestContextByInstance(rootContext: DataContext, target: object): DataContext | null {
    while (target) {
        const context = rootContext.find(c => c.target === target);
        if (context)
            return context;

        target = Object.getPrototypeOf(target);
    }
    return null;
}

function getNearestContextByConstructor(rootContext: DataContext, target: object): DataContext | null {
    let targetCtor = target.constructor;
    while (targetCtor) {
        const context = rootContext.find(c => c.target === targetCtor);
        if (context)
            return context;

        targetCtor = Object.getPrototypeOf(targetCtor);
    }
    return null;
}

function getNearestContext(rootContext: DataContext, target: object): DataContext | null {
    return getNearestContextByInstance(rootContext, target) ||
        getNearestContextByConstructor(rootContext, target);
}