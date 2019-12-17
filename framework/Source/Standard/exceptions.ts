export class FrameworkException extends Error {
    toString(): string {
        let result = "";

        result += `Failed with message: "${this.message}" \nData:`;

        for (let field of this.data) {
            let [fieldName, fieldValue] = field;

            result += `\n     ${fieldName.padEnd(20)} : ${fieldValue}`;
        }

        result += `\nStack trace: ${this.stack}`;

        return result;
    }

    constructor(message?: string, innerException?: any) {
        super();

        message = message || "A non-specified exception has been encountered.";

        this.message = message;
        this._data.set("innerException", innerException);
    }

    _data = new Map();

    get data() { return new Map(this._data); }
}

export class FormatException extends FrameworkException {
    constructor(expectedFormat?: string, receivedString?: string, message?: string, innerException?: any) {
        message = message || "The provided string was in an invalid format.";

        super(message, innerException);

        this._data.set("expectedFormat", expectedFormat);
        this._data.set("receivedString", receivedString);
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
        message = message || "Requirements for the current operation were not met.";

        super(message, innerException);
    }
}

export class InvalidTypeException extends FrameworkException {
    constructor(name?: string, type?: any, expectedType?: any, message?: string, innerException?: any) {
        message = message || "Variable has an invalid _type.";

        super(message, innerException);

        this._data.set("name", name);
        this._data.set("type", type);
        this._data.set("expectedType", expectedType);
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

        this._data.set("argumentName", argumentName);
    }
}

export class ArgumentTypeException extends ArgumentException {
    constructor(argumentName?: string, _type?: any, expectedType?: any, message?: string, innerException?: any) {
        message = message || "Argument is of incorrect _type.";
        _type = _type instanceof Function ? _type : _type ? _type.constructor : null;

        super(argumentName, message, innerException);

        this._data.set("argumentName", argumentName);
        this._data.set("_type", _type);
        this._data.set("expectedType", expectedType);
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