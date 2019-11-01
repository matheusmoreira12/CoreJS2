export class FrameworkException extends Error {
    toString() {
        let result = "";

        result += `Failed with message: "${this.message}" \nData:`;

        for (let field of this.data) {
            let [fieldName, fieldValue] = field;

            result += `\n     ${fieldName.padEnd(20)} : ${fieldValue}`;
        }

        result += `\nStack trace: ${this.stack}`;

        return result;
    }

    constructor(message = null, innerException = null) {
        message = message || "A non-specified exception has been encountered.";

        super();

        this.message = message;
        this._data.set("innerException", innerException);
    }

    _data = new Map();

    get data() { return new Map(this._data); }
}

export class FormatException extends FrameworkException {
    constructor(expectedFormat = null, receivedString = null, message = null, innerException = null) {
        message = message || "The provided string was in an invalid format.";

        super(message, innerException);

        this._data.set("expectedFormat", expectedFormat);
        this._data.set("receivedString", receivedString);
    }
}

export class IndexOutOfRangeException extends FrameworkException {
    constructor(message = null, innerException = null) {
        message = message || "The specified value was out of the collection bounds.";

        super(message, innerException);
    }
}

export class InvalidOperationException extends FrameworkException {
    constructor(message = null, innerException = null) {
        message = message || "Requirements for the current operation were not met.";

        super(message, innerException);
    }
}

export class InvalidTypeException extends FrameworkException {
    constructor(name = null, type = null, expectedType = null, message = null, innerException = null) {
        message = message || "Variable has an invalid type.";
        type = type instanceof Function ? type : type ? type.constructor : null;

        super(message, innerException);

        this._data.set("name", name);
        this._data.set("type", type);
        this._data.set("expectedType", expectedType);
    }
}

export class NotImplementedException extends FrameworkException {
    constructor(message = null, innerException = null) {
        message = message || "Feature is not implemented.";

        super(message, innerException);
    }
}

export class ArgumentException extends FrameworkException {
    constructor(argumentName, message = null, innerException = null) {
        message = message || "Argument is invalid.";

        super(message, innerException);

        this._data.set("argumentName", argumentName);
    }
}

export class ArgumentTypeException extends ArgumentException {
    constructor(argumentName = null, type = null, expectedType = null, message = null, innerException = null) {
        message = message || "Argument is of incorrect type.";
        type = type instanceof Function ? type : type ? type.constructor : null;

        super(argumentName, message, innerException);

        this._data.set("argumentName", argumentName);
        this._data.set("type", type);
        this._data.set("expectedType", expectedType);
    }
}

export class ArgumentNullException extends ArgumentException {
    constructor(argumentName, message = null, innerException = null) {
        message = message || "Argument is null or null-like.";

        super(argumentName, message, innerException);
    }
}