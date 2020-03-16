import { Class } from "../../CoreBase/Utils/Types";
import { Destructible } from "../Destructible";
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
            throw new InvalidOperationException("Cannot blend class with object. The specified class may have already been blended with the specified object.")
    }

    export function tryGet<TBlend, TSource extends Object>(blendClass: Class<TBlend>, sourceObj: TSource, output: TryOutput<TBlend>): boolean {
        const storageTryGetOutput: TryOutput<BlendedInstanceInfo<TSource, TBlend>> = {};
        if (Storage.tryGet(blendClass, sourceObj, storageTryGetOutput)) {
            const info = <BlendedInstanceInfo<TSource, TBlend>>storageTryGetOutput.result;
            const isInstanceIntitialized = info.blend !== null;
            if (isInstanceIntitialized) {
                output.result;
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
            const isInstanceIntitialized = info.blend !== null;
            if (isInstanceIntitialized)
                return false;
            else {
                output.result;
                return false;
            }
        }
        else
            return false;
    }

    export function tryDeblend<TBlend, TSource extends object>(blendClass: Class<TBlend>, sourceObj: TSource): boolean {
        const storageTryGetOutput: TryOutput<BlendedInstanceInfo<TSource, TBlend>> = {};
        if (Storage.tryGet(blendClass, sourceObj, storageTryGetOutput)) {
            const info = <BlendedInstanceInfo<TSource, TBlend>>storageTryGetOutput.result;
            const blend = info.blend;
            if (Storage.tryDiscard(blendClass, sourceObj)) {
                const isInstanceIntitialized = blend !== null;
                if (isInstanceIntitialized) {
                    if (blend instanceof Destructible) {
                        if ((<Destructible>blend).isDestructed)
                            (<Destructible>blend).destruct();
                    }
                    return true;
                }
            }
            else
                return false;
        }
        else
            return false;
    }

    export function execute<TBlend extends Object>(sourceObj: object, blendClass: Class<TBlend>): undefined;
    export function execute<TBlend extends Object, TResult>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult, undefined>): TResult | undefined;
    export function execute<TBlend extends Object, TResult, TThis>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult, TThis>, thisArg: TThis): TResult | undefined;
    export function execute<TBlend extends Object, TResult = void, TThis = never>(sourceObj: object, blendClass: Class<TBlend>, predicate: DoPredicate<TBlend, TResult, TThis>, thisArg: TThis): TResult | undefined {
        const blend = Blender.get(sourceObj, blendClass);
        const isBlended = !!blend;
        if (isBlended)
            return predicate.call(thisArg, <TBlend>blend);
        else
            return undefined;
    }
};