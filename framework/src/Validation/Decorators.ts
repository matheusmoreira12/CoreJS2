import { Type } from "../standard/reflection/index.js";
import { Interface } from "../standard/interfaces/index.js";

type Class = new() => any;
type TypeDesignator = null | undefined | Type | Interface | Class;

export function validate<T> (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
}

export function assert(...types: TypeDesignator[]): ParameterDecorator {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    }
}