import { AccessContext } from "./AccessContext";
import { TryOutput } from "../Types/Types";
import { ContextStorage } from "./ContextStorage";
import { InvalidOperationException } from "../index";

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