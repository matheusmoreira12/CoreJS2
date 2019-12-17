export declare namespace Core.Standard {
    class FrameworkException extends Error {
        toString(): string;
        constructor(message?: string, innerException?: any);
        _data: Map<any, any>;
        readonly data: Map<any, any>;
    }
    class FormatException extends FrameworkException {
        constructor(expectedFormat?: string, receivedString?: string, message?: string, innerException?: any);
    }
    class KeyNotFoundException extends FrameworkException {
        constructor(message?: string, innerException?: any);
    }
    class IndexOutOfRangeException extends FrameworkException {
        constructor(message?: string, innerException?: any);
    }
    class InvalidOperationException extends FrameworkException {
        constructor(message?: string, innerException?: any);
    }
    class InvalidTypeException extends FrameworkException {
        constructor(name?: string, type?: any, expectedType?: any, message?: string, innerException?: any);
    }
    class NotImplementedException extends FrameworkException {
        constructor(message?: string, innerException?: any);
    }
    class NotSupportedException extends FrameworkException {
        constructor(message?: string, innerException?: any);
    }
    class ArgumentException extends FrameworkException {
        constructor(argumentName?: string, message?: string, innerException?: any);
    }
    class ArgumentTypeException extends ArgumentException {
        constructor(argumentName?: string, _type?: any, expectedType?: any, message?: string, innerException?: any);
    }
    class ArgumentOutOfRangeException extends ArgumentException {
        constructor(argumentName?: string, message?: string, innerException?: any);
    }
    class ArgumentNullException extends ArgumentException {
        constructor(argumentName?: string, message?: string, innerException?: any);
    }
}
