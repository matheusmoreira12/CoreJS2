import { InvalidOperationException } from "../exceptions/index.js";
import { DependencyProperty } from "./index.js";
import { _Registry } from "./_registry.js";

export class DependencyPropertyKey<TProperty extends DependencyProperty = any> {
    get property(): TProperty {
        const property = _Registry.getPropertyFromPropertyKey(this);
        if (property)
            return property as TProperty;
        else
            throw new InvalidOperationException("Cannot get property. Invalid dependency property key.");
    }
}