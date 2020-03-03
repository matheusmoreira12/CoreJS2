import { DataContext } from "./DataContext";
import { assertParams } from "../../Validation/index";

export const Utils = {
    getNearest(rootContext: DataContext, target: object): DataContext | null {
        assertParams({ rootContext }, DataContext);
        assertParams({ target }, Object);

        return getNearestContext(rootContext, target);
    },

    get(rootContext: DataContext, target: object): DataContext | null {
        assertParams({ rootContext }, DataContext);
        assertParams({ target }, Object);

        return getContext(rootContext, target);
    }
};

function getNearestContext(rootContext: DataContext, target: object): DataContext | null {
    while (target) {
        const context = rootContext.find(c => c.target === target);
        if (context)
            return context;

        target = Object.getPrototypeOf(target);
    }
    return null;
}

function getContext(rootContext: DataContext, target: object): DataContext | null {
    return rootContext.find(c => c.target === target) || null;
}