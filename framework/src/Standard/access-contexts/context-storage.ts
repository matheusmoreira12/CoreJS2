import { AccessContext } from "./AccessContext.js";
import { TryOutput } from "../Reflection/Types.js";

function objExtends(obj: Function, objCtor: Function): boolean {
    while (obj instanceof Function) {
        if (obj === objCtor)
            return true;
        obj = Object.getPrototypeOf(obj);
    }
    return false;
}

function protectedContextMatches(target: object, context: AccessContext<object>, instance: object | Function): boolean {
    if (instance !== undefined && instance != null) {
        if (context.public === target) {
            const instanceCtor: Function = (instance instanceof Function) ? instance : instance.constructor;
            return objExtends(instanceCtor, context.public.constructor);
        }
        else
            return false;
    }
    else
        return false;
}

function privateContextMatches(target: object, context: AccessContext<object>, instance: object | Function) {
    if (instance !== undefined && instance != null) {
        if (context.public === target) {
            const instanceCtor: Function = (instance instanceof Function) ? instance : instance.constructor;
            return instanceCtor === context.public.constructor;
        }
        else
            return false;
    }
    else
        return false;
}

export namespace ContextStorage {
    const protectedContexts: AccessContext<object>[] = [];
    const privateContexts: AccessContext<object>[] = [];

    export function definePrivate<TTarget extends object>(target: TTarget, instance: object | Function, output: TryOutput<AccessContext<TTarget>> = {}): boolean {
        if (tryGetPrivate(target, instance))
            return false;
        else {
            const context = AccessContext.createFor(target);
            output.result = context;
            return true;
        }
    }

    export function tryGetPrivate<TTarget extends object>(target: TTarget, instance: object | Function, output: TryOutput<AccessContext<TTarget>> = {}): boolean {
        const context = privateContexts.find(pc => privateContextMatches(target, pc, instance));
        if (context) {
            output.result = <AccessContext<TTarget>>context;
            return true;
        }
        else
            return false;
    }

    export function defineProtected<TTarget extends object>(target: TTarget, instance: object | Function, output: TryOutput<AccessContext<TTarget>>): boolean {
        if (tryGetProtected(target, instance))
            return false;
        else {
            const context = AccessContext.createFor(target);
            output.result = context;
            return true;
        }
    }

    export function tryGetProtected<TTarget extends object>(target: TTarget, instance: object | Function, output: TryOutput<AccessContext<TTarget>> = {}): boolean {
        const context = protectedContexts.find(pc => protectedContextMatches(target, pc, instance));
        if (context) {
            output.result = <AccessContext<TTarget>>context;
            return true;
        }
        else
            return false;
    }
}