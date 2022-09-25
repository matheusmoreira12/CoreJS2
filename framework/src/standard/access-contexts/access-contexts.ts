import { InvalidOperationException } from "../exceptions/index.js"
import { OutputArgument } from "../reflection/types";
import { AccessContext } from "./access-context.js";
import { ContextStorage } from "./context-storage.js";

export namespace AccessContexts {
    export function getPrivate<TTarget extends object>(target: TTarget): AccessContext<TTarget> {
        const storageTryGetResult: OutputArgument<AccessContext<TTarget>> = {};
        if (ContextStorage.tryGetPrivate(target, getPrivate.caller, storageTryGetResult))
            return <AccessContext<TTarget>>storageTryGetResult.value;
        else
            throw new InvalidOperationException("Cannot access private context.");
    }

    export function getProtected<TTarget extends object>(target: TTarget): AccessContext<TTarget> {
        const storageTryGetResult: OutputArgument<AccessContext<TTarget>> = {};
        if (ContextStorage.tryGetProtected(target, getProtected.caller, storageTryGetResult))
            return <AccessContext<TTarget>>storageTryGetResult.value;
        else
            throw new InvalidOperationException("Cannot access protected context.");
    }
}