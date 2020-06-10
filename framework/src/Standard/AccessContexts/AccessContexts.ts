import { AccessContext } from "./AccessContext.js";
import { TryOutput } from "../Reflection/Types.js";
import { ContextStorage } from "./ContextStorage.js";
import { InvalidOperationException } from "../Exceptions/index.js"

export function getPrivate<TTarget extends object>(target: TTarget): AccessContext<TTarget> {
    const storageTryGetResult: TryOutput<AccessContext<TTarget>> = {};
    if (ContextStorage.tryGetPrivate(target, getPrivate.caller, storageTryGetResult))
        return <AccessContext<TTarget>>storageTryGetResult.result;
    else
        throw new InvalidOperationException("Cannot access private context.");
}

export function priv<TTarget extends object, TResult>(target: TTarget, predicate: (this: AccessContext<TTarget>) => TResult): TResult {
    const privateContext = getPrivate(target);
    return predicate.call(privateContext);
}

export function getProtected<TTarget extends object>(target: TTarget): AccessContext<TTarget> {
    const storageTryGetResult: TryOutput<AccessContext<TTarget>> = {};
    if (ContextStorage.tryGetProtected(target, getProtected.caller, storageTryGetResult))
        return <AccessContext<TTarget>>storageTryGetResult.result;
    else
        throw new InvalidOperationException("Cannot access protected context.");
}

export function prot<TTarget extends object, TResult>(target: TTarget, predicate: (this: AccessContext<TTarget>) => TResult): TResult {
    const protectedContext = getPrivate(target);
    return predicate.call(protectedContext);
}