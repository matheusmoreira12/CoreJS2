export declare class FrameworkException extends Error {
    toString(): string;
    constructor(message?: string, innerException?: any);
    _data: Map<any, any>;
    get data(): Map<any, any>;
}
export declare class FormatException extends FrameworkException {
    constructor(expectedFormat?: string, receivedString?: string, message?: string, innerException?: any);
}
export declare class KeyNotFoundException extends FrameworkException {
    constructor(message?: string, innerException?: any);
}
export declare class IndexOutOfRangeException extends FrameworkException {
    constructor(message?: string, innerException?: any);
}
export declare class InvalidOperationException extends FrameworkException {
    constructor(message?: string, innerException?: any);
}
export declare class InvalidTypeException extends FrameworkException {
    constructor(name?: string, type?: any, expectedType?: any, message?: string, innerException?: any);
}
export declare class NotImplementedException extends FrameworkException {
    constructor(message?: string, innerException?: any);
}
export declare class NotSupportedException extends FrameworkException {
    constructor(message?: string, innerException?: any);
}
export declare class ArgumentException extends FrameworkException {
    constructor(argumentName?: string, message?: string, innerException?: any);
}
export declare class ArgumentTypeException extends ArgumentException {
    constructor(argumentName?: string, _type?: any, expectedType?: any, message?: string, innerException?: any);
}
export declare class ArgumentOutOfRangeException extends ArgumentException {
    constructor(argumentName?: string, message?: string, innerException?: any);
}
export declare class ArgumentNullException extends ArgumentException {
    constructor(argumentName?: string, message?: string, innerException?: any);
}
