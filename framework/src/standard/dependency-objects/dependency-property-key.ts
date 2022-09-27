import { OutputArgument } from "../reflection/types";
import { InvalidOperationException } from "../exceptions/index.js";
import { DependencyProperty } from "./index.js";
import { __Registry } from "./__registry.js";
import { Guid } from "../guids/index.js";

export class DependencyPropertyKey {
    get property(): DependencyProperty {
        const tryGetPropertyFromPropertyKeyOutput: OutputArgument<DependencyProperty> = {};
        if (__Registry.tryGetByKey(this, tryGetPropertyFromPropertyKeyOutput))
            return tryGetPropertyFromPropertyKeyOutput.value!;
        throw new InvalidOperationException("Cannot get property. Invalid dependency property key.");
    }

    get id() {
        return this.__id ?? (() => { throw new InvalidOperationException("Cannot get id. Invalid dependency property key.") })();
    }
    __id: Guid | null = null;
}