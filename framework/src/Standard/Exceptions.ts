export class FrameworkException extends Error {
    constructor(message?: string, innerException?: any) {
        super();

        message = message || "An exception has ocurred.";

        this.__message = message;
        this.__data.set("innerException", innerException);
    }

    get message() { return this.__message; }
    __message: string;

    get data() { return new Map(this.__data); }
    __data = new Map();
}

export class FormatException extends FrameworkException {
    constructor(expectedFormat?: string, receivedString?: string, message?: string, innerException?: any) {
        message = message || "The provided string was in an invalid format.";

        super(message, innerException);

        this.__data.set("expectedFormat", expectedFormat);
        this.__data.set("receivedString", receivedString);
    }
}

export class KeyNotFoundException extends FrameworkException {
    constructor(message?: string, innerException?: any) {
        message = message || "The requested value could not be found.";

        super(message, innerException);
    }
}

export class IndexOutOfRangeException extends FrameworkException {
    constructor(message?: string, innerException?: any) {
        message = message || "The specified value was out of the collection bounds.";

        super(message, innerException);
    }
}

export class InvalidOperationException extends FrameworkException {
    constructor(message?: string, innerException?: any) {
        message = message || "Conditions for the current operation were not met.";

        super(message, innerException);
    }
}

export class InvalidTypeException extends FrameworkException {
    constructor(name?: string, type?: any, expectedType?: any, message?: string, innerException?: any) {
        message = message || "Variable has an invalid type.";

        super(message, innerException);

        this.__data.set("name", name);
        this.__data.set("type", type);
        this.__data.set("expectedType", expectedType);
    }
}

export class NotImplementedException extends FrameworkException {
    constructor(message?: string, innerException?: any) {
        message = message || "Feature is not implemented.";

        super(message, innerException);
    }
}

export class NotSupportedException extends FrameworkException {
    constructor(message?: string, innerException?: any) {
        message = message || "Feature is not supported.";

        super(message, innerException);
    }
}

export class ArgumentException extends FrameworkException {
    constructor(argumentName?: string, message?: string, innerException?: any) {
        message = message || "Argument is invalid.";

        super(message, innerException);

        this.__data.set("argumentName", argumentName);
    }
}

export class ArgumentMissingException extends ArgumentException {
    constructor(argumentName?: string, message?: string, innerException?: any) {
        message = message || "Argument is missing.";

        super(message, innerException);

        this.__data.set("argumentName", argumentName);
    }
}

export class ArgumentTypeException extends ArgumentException {
    constructor(argumentName?: string, _type?: any, expectedType?: any, message?: string, innerException?: any) {
        message = message || "Argument is of incorrect type.";
        _type = _type instanceof Function ? _type : _type ? _type.constructor : null;

        super(argumentName, message, innerException);

        this.__data.set("argumentName", argumentName);
        this.__data.set("_type", _type);
        this.__data.set("expectedType", expectedType);
    }
}

export class ArgumentOutOfRangeException extends ArgumentException {
    constructor(argumentName?: string, message?: string, innerException?: any) {
        message = message || "Argument was out of the expected range.";

        super(argumentName, message, innerException);
    }
}

export class ArgumentNullException extends ArgumentException {
    constructor(argumentName?: string, message?: string, innerException?: any) {
        message = message || "Argument is null or null-like.";

        super(argumentName, message, innerException);
    }
}