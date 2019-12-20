import { Shell } from "./Standard.Closures.js";
export declare class DestructuringExpressionArgument extends Shell {
    static parse(value: any): DestructuringExpressionArgument;
    static tryParse(value: any, outputObj: any): boolean;
    constructor(name: any, defaultValue: any);
    readonly name: any;
    readonly defaultValue: any;
}
export declare const DestructuringExpressionType: any;
export declare class DestructuringExpression extends Shell {
    static parseArguments(value: any): Generator<DestructuringExpressionArgument, void, unknown>;
    static parse(value: any): any;
    static tryParse(value: any, outputObj: any): boolean;
    constructor(type: any, ..._arguments: any[]);
    readonly type: any;
    readonly arguments: any;
}
export declare class ArrayDestructuringExpression extends DestructuringExpression {
    static parse(value: any): ArrayDestructuringExpression;
    static tryParse(value: any, outputObj: any): boolean;
    constructor(..._arguments: any[]);
}
export declare class ObjectDestructuringExpression extends DestructuringExpression {
    static parse(value: any): ObjectDestructuringExpression;
    static tryParse(value: any, outputObj: any): boolean;
    constructor(..._arguments: any[]);
}
export declare const FunctionParameterType: any;
export declare class FunctionParameterModel extends Shell {
    static parse(value: any): any;
    static tryParse(value: any, outputObj: any): boolean;
    constructor(name: any, parameterType: any, defaultValue: any, destructuringExpression: any);
    toString(): any;
    readonly name: any;
    readonly parameterType: any;
    readonly defaultValue: any;
}
export declare class FunctionSimpleParameterModel extends FunctionParameterModel {
    static parse(value: any): FunctionSimpleParameterModel;
    static tryParse(value: any, outputObj: any): boolean;
    constructor(name: any, defaultValue: any);
}
export declare class FunctionSpreadParameterModel extends FunctionParameterModel {
    static parse(value: any): FunctionSpreadParameterModel;
    static tryParse(value: any, outputObj: any): boolean;
    constructor(name: any);
}
export declare class FunctionDestructuringParameterModel extends FunctionParameterModel {
    static parse(value: any): FunctionDestructuringParameterModel;
    constructor(destructuringExpression: any, defaultValue: any);
}
export declare class FunctionModel extends Shell {
    static parse(value: any): FunctionModel;
    constructor(name: any, body: any, ...parameters: any[]);
    getInvokable(): any;
    readonly parameters: any;
}
