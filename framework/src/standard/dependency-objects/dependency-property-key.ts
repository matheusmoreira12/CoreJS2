import { OutputArgument } from "../reflection/types";
import { InvalidOperationException } from "../exceptions/index.js";
import { DependencyProperty } from "./index.js";
import { __Registry } from "./__registry.js";

export class DependencyPropertyKey {
    get property(): DependencyProperty {
        const tryGetPropertyFromPropertyKeyOutput: OutputArgument<DependencyProperty> = {};
        if (__Registry.tryGetProperty(this, tryGetPropertyFromPropertyKeyOutput))
            return tryGetPropertyFromPropertyKeyOutput.value!;
        throw new InvalidOperationException("Cannot get property. Invalid dependency property key.");
    }
}