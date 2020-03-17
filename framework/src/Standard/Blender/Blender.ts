import { Class } from "../../CoreBase/Utils/Types";
import { DoPredicate } from "./Types";
import { Storage } from "./Storage";
import { InvalidOperationException } from "../Exceptions";
import { TryOutput } from "../Types/Types";
import { BlendedInstanceInfo } from "./BlendedInstanceInfo";

export namespace Blender {
    export function tryBlend<TTarget extends object, TBlend>(blendClass: Class<TBlend>, targetObj: TTarget): boolean {
        const isBlendSuccessful = Storage.tryStore(blendClass, targetObj);
        if (isBlendSuccessful)
            return true;
        else
            return false;
    }

    export function blend<TTarget extends object, TBlend>(blendClass: Class<TBlend>, targetObj: TTarget) {
        if (!tryBlend(blendClass, targetObj))
            throw new InvalidOperationException("Cannot blend class with object. The specified class may have already been blended with the specified object.");
    }

    export function tryGet<TBlend, TSource extends Object>(blendClass: Class<TBlend>, sourceObj: TSource, output: TryOutput<TBlend> = {}): boolean {
        const storageTryGetOutput: TryOutput<BlendedInstanceInfo<TSource, TBlend>> = {};
        output = output || {};

        if (Storage.tryGet(blendClass, sourceObj, storageTryGetOutput)) {
            const info = <BlendedInstanceInfo<TSource, TBlend>>storageTryGetOutput.result;
            const isInstanceIntitialized = info.blend !== null;
            if (isInstanceIntitialized) {
                output.result = <TBlend>info.blend;
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }

    export function get<TBlend, TSource extends Object>(blendClass: Class<TBlend>, sourceObj: TSource): TBlend {
        const tryGetOutput: TryOutput<TBlend> = {};
        if (tryGet(blendClass, sourceObj, tryGetOutput)) {
            const blend = <TBlend>tryGetOutput.result;
            return blend;
        }
        else
            throw new InvalidOperationException("Cannot get blend from the specified object by the specified class. The specified class may have not been blended with the specified object, or the instance may not have been initialized.");
    }

    export function tryInitialize<TBlend, TSource extends object>(sourceObj: object, blendClass: Class<TBlend>, output: TryOutput<TBlend>, ...constructorArgs: []): boolean {
        const storageTryGetOutput: TryOutput<BlendedInstanceInfo<TSource, TBlend>> = {};
        if (Storage.tryGet(blendClass, sourceObj, storageTryGetOutput)) {
            const info = <BlendedInstanceInfo<TSource, TBlend>>storageTryGetOutput.result;
            const isBlendIntitialized = info.blend !== null;
            if (isBlendIntitialized)
                return false;
            else {
                const blend = new blendClass(...constructorArgs);
                info.blend = blend;
                output.result = blend;
                return true;
            }
        }
        else
            return false;
    }

    export function initialize<TBlend, TSource extends Object>(blendClass: Class<TBlend>, sourceObj: TSource) {
        const tryInitializeOutput: TryOutput<TBlend> = {};
        if (tryInitialize(sourceObj, blendClass, tryInitializeOutput))
            return tryInitializeOutput.result;
        else
            throw new InvalidOperationException("Cannot initialize an instance for the specified class on the specified object. The specified class may have not been blended with the specified object.");
    }

    export function tryDeblend<TBlend, TSource extends object>(blendClass: Class<TBlend>, sourceObj: TSource): boolean {
        if (Storage.tryDiscard(blendClass, sourceObj))
            return true;
        else
            return false;
    }

    export function deBlend<TBlend, TSource extends Object>(blendClass: Class<TBlend>, sourceObj: TSource) {
        if (!tryDeblend(blendClass, sourceObj))
            throw new InvalidOperationException("Cannot de-blend from the specified class from the specified object. The specified class may have not been blended with the specified object.");
    }

    export function tryExecute<TBlend extends Object, TResult>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult>, output: TryOutput<TResult>): TResult | undefined;
    export function tryExecute<TBlend extends Object, TResult, TThis>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult, TThis>, thisArg: TThis, output: TryOutput<TResult>): TResult | undefined;
    export function tryExecute<TBlend extends Object, TResult = any, TThisArg = any>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult, TThisArg>, thisArg?: TThisArg, output?: TryOutput<TResult>): boolean {
        output = output || {};

        const tryGetOutput = {};
        if (Blender.tryGet(blendClass, sourceObj, tryGetOutput)) {
            output.result = predicate.call(<TThisArg>thisArg, <TBlend>(<TryOutput<TBlend>>tryGetOutput).result);
            return true;
        }
        else
            return false;
    }

    export function execute<TBlend extends Object, TResult = any>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult>): TResult;
    export function execute<TBlend extends Object, TResult = any, TThisArg = any>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult, TThisArg>, thisArg?: TThisArg): TResult;
    export function execute<TBlend extends Object, TResult = any, TThisArg = any>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult, TThisArg>, thisArg?: TThisArg): TResult {
        const tryExecuteOutput: TryOutput<TResult> = {};
        if (tryExecute(sourceObj, blendClass, predicate, <TThisArg>thisArg, tryExecuteOutput))
            return <TResult>tryExecuteOutput.result;
        else
            throw new InvalidOperationException("Cannot de-blend from the specified class from the specified object. The specified class may have not been blended with the specified object.");
    }
};