import { OutputArgument } from "../reflection/types";
import { InvalidOperationException } from "../exceptions/index.js";
import { DependencyProperty } from "./index.js";
import { __Registry } from "./__registry.js";
import { Guid } from "../guids/index.js";

export class DependencyPropertyKey {
    get property(): DependencyProperty {
        const tryGetPropertyFromPropertyKeyOutput: OutputArgument<DependencyProperty> = {};
        if (__Registry.tryGetPropertyByPropertyKey(this, tryGetPropertyFromPropertyKeyOutput))
            return tryGetPropertyFromPropertyKeyOutput.value!;
        throw new InvalidOperationException("Cannot get property.");
    }

    get id() {
        return this.__id ?? (() => { throw new InvalidOperationException("Cannot get id. Invalid DependencyPropertyKey.") })();
    }
    __id: Guid | null = null;
}