import { ClassOf, TryOutput } from "../reflection/types";
import { InvalidOperationException } from "../exceptions/index.js";
import { BlendedInstanceInfo } from "./blended-instance-info.js";
import { Storage } from "./storage.js";
import { ExecutePredicate } from "./types";

export namespace Blender {
    export function tryBlend<TTarget extends object, TBlend extends object>(blendClass: ClassOf<TBlend>, targetObj: TTarget): boolean {
        const isBlendSuccessful = Storage.tryStore(blendClass, targetObj);
        if (isBlendSuccessful)
            return true;
        else
            return false;
    }

    export function blend<TTarget extends object, TBlend extends object>(blendClass: ClassOf<TBlend>, targetObj: TTarget) {
        if (!tryBlend(blendClass, targetObj))
            throw new InvalidOperationException("Cannot blend class with object. The specified class may have already been blended with the specified object.");
    }

    export function tryGet<TBlend extends object, TSource extends object>(blendClass: ClassOf<TBlend>, sourceObj: TSource, output: TryOutput<TBlend> = {}): boolean {
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

    export function get<TBlend extends object, TSource extends object>(blendClass: ClassOf<TBlend>, sourceObj: TSource): TBlend {
        const tryGetOutput: TryOutput<TBlend> = {};
        if (tryGet(blendClass, sourceObj, tryGetOutput)) {
            const blend = <TBlend>tryGetOutput.result;
            return blend;
        }
        else
            throw new InvalidOperationException("Cannot get blend from the specified object by the specified class. The specified class may have not been blended with the specified object, or the instance may not have been initialized.");
    }

    export function tryInitialize<TBlend extends object, TSource extends object>(sourceObj: TSource, blendClass: ClassOf<TBlend>, output: TryOutput<TBlend>, ...constructorArgs: []): boolean {
        const storageTryGetOutput: TryOutput<BlendedInstanceInfo<TSource, TBlend>> = {};
        if (Storage.tryGet(blendClass, sourceObj, storageTryGetOutput)) {
            const info = <BlendedInstanceInfo<TSource, TBlend>>storageTryGetOutput.result;
            const isBlendIntitialized = info.blend !== null;
            if (isBlendIntitialized)
                return false;
            else {
                const blend = new (<(new() => TBlend)><unknown>blendClass)(...constructorArgs);
                info.blend = blend;
                output.result = blend;
                return true;
            }
        }
        else
            return false;
    }

    export function initialize<TBlend extends object, TSource extends object>(blendClass: ClassOf<TBlend>, sourceObj: TSource): TBlend {
        const tryInitializeOutput: TryOutput<TBlend> = {};
        if (tryInitialize(sourceObj, blendClass, tryInitializeOutput))
            return tryInitializeOutput.result!;
        else
            throw new InvalidOperationException("Cannot initialize an instance for the specified class on the specified object. The specified class may have not been blended with the specified object.");
    }

    export function tryUnBlend<TBlend extends object, TSource extends object>(blendClass: ClassOf<TBlend>, sourceObj: TSource): boolean {
        if (Storage.tryDiscard(blendClass, sourceObj))
            return true;
        else
            return false;
    }

    export function deBlend<TBlend extends object, TSource extends object>(blendClass: ClassOf<TBlend>, sourceObj: TSource) {
        if (!tryUnBlend(blendClass, sourceObj))
            throw new InvalidOperationException("Cannot un-blend from the specified class from the specified object. The specified class may have not been blended with the specified object.");
    }

    export function tryExecute<TBlend extends object, TResult>(sourceObj: object, blendClass: ClassOf<TBlend>, predicate: ExecutePredicate<TBlend, TResult>, output: TryOutput<TResult>): boolean;
    export function tryExecute<TBlend extends object, TResult, TThis>(sourceObj: object, blendClass: ClassOf<TBlend>, predicate: ExecutePredicate<TBlend, TResult, TThis>, thisArg: TThis, output: TryOutput<TResult>): boolean;
    export function tryExecute<TBlend extends object, TResult = any, TThisArg = any>(sourceObj: object, blendClass: ClassOf<TBlend>, predicate: ExecutePredicate<TBlend, TResult, TThisArg>, thisArg?: TThisArg, output?: TryOutput<TResult>): boolean {
        output = output || {};

        const tryGetOutput = {};
        if (Blender.tryGet(blendClass, sourceObj, tryGetOutput)) {
            output.result = predicate.call(<TThisArg>thisArg, <TBlend>(<TryOutput<TBlend>>tryGetOutput).result);
            return true;
        }
        else
            return false;
    }

    export function execute<TBlend extends object, TResult = any>(sourceObj: object, blendClass: ClassOf<TBlend>, predicate: ExecutePredicate<TBlend, TResult>): TResult;
    export function execute<TBlend extends object, TResult = any, TThisArg = any>(sourceObj: object, blendClass: ClassOf<TBlend>, predicate: ExecutePredicate<TBlend, TResult, TThisArg>, thisArg?: TThisArg): TResult;
    export function execute<TBlend extends object, TResult = any, TThisArg = any>(sourceObj: object, blendClass: ClassOf<TBlend>, predicate: ExecutePredicate<TBlend, TResult, TThisArg>, thisArg?: TThisArg): TResult {
        const tryExecuteOutput: TryOutput<TResult> = {};
        if (tryExecute(sourceObj, blendClass, predicate, <TThisArg>thisArg, tryExecuteOutput))
            return <TResult>tryExecuteOutput.result;
        else
            throw new InvalidOperationException("Cannot execute the specified predicate with the specified class instance in the specified object. The specified class may have not been blended with the specified object.");
    }
};