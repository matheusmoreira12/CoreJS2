export var Core;
(function (Core) {
    var Standard;
    (function (Standard) {
        class FrameworkException extends Error {
            constructor(message, innerException) {
                super();
                this._data = new Map();
                message = message || "A non-specified exception has been encountered.";
                this.message = message;
                this._data.set("innerException", innerException);
            }
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
            get data() { return new Map(this._data); }
        }
        Standard.FrameworkException = FrameworkException;
        class FormatException extends FrameworkException {
            constructor(expectedFormat, receivedString, message, innerException) {
                message = message || "The provided string was in an invalid format.";
                super(message, innerException);
                this._data.set("expectedFormat", expectedFormat);
                this._data.set("receivedString", receivedString);
            }
        }
        Standard.FormatException = FormatException;
        class KeyNotFoundException extends FrameworkException {
            constructor(message, innerException) {
                message = message || "The requested value could not be found.";
                super(message, innerException);
            }
        }
        Standard.KeyNotFoundException = KeyNotFoundException;
        class IndexOutOfRangeException extends FrameworkException {
            constructor(message, innerException) {
                message = message || "The specified value was out of the collection bounds.";
                super(message, innerException);
            }
        }
        Standard.IndexOutOfRangeException = IndexOutOfRangeException;
        class InvalidOperationException extends FrameworkException {
            constructor(message, innerException) {
                message = message || "Requirements for the current operation were not met.";
                super(message, innerException);
            }
        }
        Standard.InvalidOperationException = InvalidOperationException;
        class InvalidTypeException extends FrameworkException {
            constructor(name, type, expectedType, message, innerException) {
                message = message || "Variable has an invalid _type.";
                super(message, innerException);
                this._data.set("name", name);
                this._data.set("type", type);
                this._data.set("expectedType", expectedType);
            }
        }
        Standard.InvalidTypeException = InvalidTypeException;
        class NotImplementedException extends FrameworkException {
            constructor(message, innerException) {
                message = message || "Feature is not implemented.";
                super(message, innerException);
            }
        }
        Standard.NotImplementedException = NotImplementedException;
        class NotSupportedException extends FrameworkException {
            constructor(message, innerException) {
                message = message || "Feature is not supported.";
                super(message, innerException);
            }
        }
        Standard.NotSupportedException = NotSupportedException;
        class ArgumentException extends FrameworkException {
            constructor(argumentName, message, innerException) {
                message = message || "Argument is invalid.";
                super(message, innerException);
                this._data.set("argumentName", argumentName);
            }
        }
        Standard.ArgumentException = ArgumentException;
        class ArgumentTypeException extends ArgumentException {
            constructor(argumentName, _type, expectedType, message, innerException) {
                message = message || "Argument is of incorrect _type.";
                _type = _type instanceof Function ? _type : _type ? _type.constructor : null;
                super(argumentName, message, innerException);
                this._data.set("argumentName", argumentName);
                this._data.set("_type", _type);
                this._data.set("expectedType", expectedType);
            }
        }
        Standard.ArgumentTypeException = ArgumentTypeException;
        class ArgumentOutOfRangeException extends ArgumentException {
            constructor(argumentName, message, innerException) {
                message = message || "Argument was out of the expected range.";
                super(argumentName, message, innerException);
            }
        }
        Standard.ArgumentOutOfRangeException = ArgumentOutOfRangeException;
        class ArgumentNullException extends ArgumentException {
            constructor(argumentName, message, innerException) {
                message = message || "Argument is null or null-like.";
                super(argumentName, message, innerException);
            }
        }
        Standard.ArgumentNullException = ArgumentNullException;
    })(Standard = Core.Standard || (Core.Standard = {}));
})(Core || (Core = {}));
