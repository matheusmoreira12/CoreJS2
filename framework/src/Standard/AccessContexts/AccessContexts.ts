import { AccessContext } from "./AccessContext.js";
import { TryOutput } from "../Types/Types.js";
import { ContextStorage } from "./ContextStorage.js";
import { InvalidOperationException } from "../Exceptions/index.js"

export namespace AccessContexts {
    export function getPrivate<TTarget extends object>(target: TTarget): AccessContext<TTarget> {
        const storageTryGetResult: TryOutput<AccessContext<TTarget>> = {};
        if (ContextStorage.tryGetPrivate(target, getPrivate.caller, storageTryGetResult))
            return <AccessContext<TTarget>>storageTryGetResult.result;
        else
            throw new InvalidOperationException("Cannot access private context.");
    }

    export function getProtected<TTarget extends object>(target: TTarget): AccessContext<TTarget> {
        const storageTryGetResult: TryOutput<AccessContext<TTarget>> = {};
        if (ContextStorage.tryGetProtected(target, getProtected.caller, storageTryGetResult))
            return <AccessContext<TTarget>>storageTryGetResult.result;
        else
            throw new InvalidOperationException("Cannot access protected context.");
    }
}