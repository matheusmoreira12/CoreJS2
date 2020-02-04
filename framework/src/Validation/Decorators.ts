import { Type } from "../Standard/Types/index";

export function validate(): MethodDecorator {
    return function<T> (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) {
    };
}

export function assert(type: any): ParameterDecorator;
export function assert(type: Type): ParameterDecorator;
export function assert(types: any[]): ParameterDecorator;
export function assert(types: Type[]): ParameterDecorator;
export function assert(type: any | any[]) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
    }
}