import { ArgumentTypeException, FormatException } from "./exceptions.js";
import { Enumeration } from "./Standard.Enumeration.js";
import { BroadcastFrameworkEvent } from "./Standard.Events.js";
import { Interface, InterfaceFunction } from "./Standard.Types.js";

/**
 * ReverseIterator class
 * Iterates backwards through an Iterable.
 */
export class ReverseIterator {
    constructor(iterable) {
        this._iterable = iterable;
        this._index = iterable.length;
    }

    [Symbol.iterator] = () => this;

    next() {
        this._index--;

        return {
            done: this._index < 0,
            value: this._iterable[this._index]
        };
    }
}

/**
 * ContextSelectionFlags Class
 * Allows the selection of individual flags.*/
export class ContextSelectionFlags {
    static [Symbol.species]() { return String; }

    static get all() { return new ContextSelectionFlags(["*"], null, null); }

    static get none() { return new ContextSelectionFlags(null, null, ["*"]) }

    static parse(str) {
        if (typeof str !== "string") throw new ArgumentTypeException(str, String);

        const MEMBER_PATTERN = "(\\w+(\\s+)?|\\*)+";
        const FORMAT_PATTERN = `^(?<include>${MEMBER_PATTERN})?(!(?<require>${MEMBER_PATTERN}))?(-(?<exclude>${MEMBER_PATTERN}))?$`;
        const SEPARATOR_REGEX = /\s*,\s*/;

        let FORMAT_REGEX = new RegExp(FORMAT_PATTERN);

        let matches = FORMAT_REGEX.exec(str);

        if (!matches)
            return null;

        let { include: includeFlagsStr, require: requireFlagsStr, exclude: excludeFlagsStr } = matches.groups;

        let includeFlags = includeFlagsStr ? includeFlagsStr.split(SEPARATOR_REGEX) : [];
        let requireFlags = requireFlagsStr ? requireFlagsStr.split(SEPARATOR_REGEX) : [];
        let excludeFlags = excludeFlagsStr ? excludeFlagsStr.split(SEPARATOR_REGEX) : [];

        return new ContextSelectionFlags(includeFlags, requireFlags, excludeFlags);
    }

    constructor(includeFlags = null, requireFlags = null, excludeFlags = null) {
        this._includeFlags = includeFlags || [];
        this._requireFlags = requireFlags || [];
        this._excludeFlags = excludeFlags || [];
    }

    toString() {
        let str = "";

        str += this._includeFlags.join(", ");

        if (this._requireFlags.length > 0)
            str += " !" + this._requireFlags.join(", ");

        if (this._excludeFlags.length > 0)
            str += " -" + this._excludeFlags.join(", ");

        return str;
    }

    matchesFlag(flag) {
        const includeFlags = this._includeFlags;
        const requireFlags = this._requireFlags;
        const excludeFlags = this._excludeFlags;

        function flagsInclude(flag, flags) {
            if (flags.includes("*")) return true;

            if (flags.includes(flag)) return true;

            return false;
        }

        return !flagsInclude(flag, excludeFlags) && flagsInclude(flag, includeFlags);
    }

    matches(contextFlags) {
        return !this._excludeFlags.some(f => contextFlags.matchesFlag(f)) &&
            this._includeFlags.some(f => contextFlags.matchesFlag(f));
    }
}

export class ServerTaskError {
    constructor(message, errorCode) {
        this.message = message;
        this.errorCode = errorCode;
    }

    [Symbol.toString]() {
        return this.message;
    }
}

const DEFAULT_SERVER_TASK_OPTIONS = {
    timeout: 60 * 1000,
    maxRetries: 0
};

export const ServerTaskStatus = new Enumeration([
    "Pending",
    "Started",
    "Retried",
    "Failed",
    "TimedOut",
    "Success"
]);

//Keys for ServerTask
/**
 * ServerTask class
 * Extends the promise class, providing server-side error handling logic.*/
export class ServerTask extends Promise {
    static get [Symbol.species]() { return Promise; }

    constructor(promise, options) {
        let _resolve, _reject;

        if (!(promise instanceof Promise)) throw new ArgumentTypeException("promise", Promise);

        super((resolve, reject) => {
            _resolve = resolve;
            _reject = reject;
        });

        options = Object.assign({}, DEFAULT_SERVER_TASK_OPTIONS, options);

        this._options = options;

        this._execute(promise, _resolve, _reject);
    }

    _execute(promise, resolve, reject) {
        let retries = 0;
        let timeoutHandle = null;

        function notifyStatus(status) {
            this._status = status;

            this.statusChangedEvent.broadcast(this, { status: status });
        }

        function notifyStart() {
            notifyStatus.call(this, ServerTaskStatus.Started);

            this.startedEvent.broadcast(this);
        }

        function notifyRetry(error, retries) {
            notifyStatus.call(this, ServerTaskStatus.Retried);

            this._retries = retries;

            this.retriedEvent.broadcast(this, { error: error, retries: retries });
        }

        function notifyTimeout() {
            notifyStatus.call(this, ServerTaskStatus.TimedOut);

            this.timedOutEvent.broadcast(this);
        }

        function notifySuccess() {
            notifyStatus.call(this, ServerTaskStatus.Succeeded);

            this.succeededEvent.broadcast(this);
            this.finishedEvent.broadcast(this, { error: null });
        }

        function notifyError(error) {
            notifyStatus.call(this, ServerTaskStatus.Failed);

            this._error = error;

            this.failedEvent.broadcast(this, { error: error });
            this.finishedEvent.broadcast(this);
        }

        function abort(error) {
            notifyError.call(this, error);

            reject(error);
        }

        function failed(error) {
            if (retries > this._options.maxRetries || error instanceof ServerTaskError)
                abort.call(this, error);
            else
                retry.call(this, error);

            clearTimeout(timeoutHandle);
        }

        function succeeded(result) {
            notifySuccess.call(this);

            resolve(result);

            clearTimeout(timeoutHandle);
        }

        function timedOut() {
            notifyTimeout.call(this, ServerTaskStatus.TimedOut);

            failed.call(this, null);

            clearTimeout(timeoutHandle);
        }

        function retry(error) {
            /*timeoutHandle = setTimeout(timedOut.bind(this), this._options.timeout);*/

            promise.then(value => { //Fulfilled
                succeeded.call(this, value);
            }, reason => { //Rejected
                failed.call(this, reason);
            });

            if (retries > 0)
                notifyRetry.call(this, error, retries);
            else
                notifyStart.call(this);

            retries++;
        }

        retry.call(this);
    }

    _timedOutEvent = new BroadcastFrameworkEvent("ServerTask_timedOut");
    _retriedEvent = new BroadcastFrameworkEvent("ServerTask_retried");
    _statusChangedEvent = new BroadcastFrameworkEvent("ServerTask_statusChanged");
    _startedEvent = new BroadcastFrameworkEvent("ServerTask_started");
    _finishedEvent = new BroadcastFrameworkEvent("ServerTask_finished");
    _succeededEvent = new BroadcastFrameworkEvent("ServerTask_succeeded");
    _failedEvent = new BroadcastFrameworkEvent("ServerTask_failed");

    _status = ServerTaskStatus.Pending;
    _error = null;

    get timedOutEvent() { return this._timedOutEvent; }
    get retriedEvent() { return this._retriedEvent; }
    get statusChangedEvent() { return this._statusChangedEvent; }
    get startedEvent() { return this._startedEvent; }
    get finishedEvent() { return this._finishedEvent; }
    get succeededEvent() { return this._succeededEvent; }
    get failedEvent() { return this._failedEvent; }

    get status() { return this._status; }
    get error() { return this._error; }
    get maxRetries() { return this._maxRetries; }
    get retries() { return this._retries; }
    get timeout() { return this._timeout; }
}

export const IValueConverter = new Interface(
    new InterfaceFunction("convert"),
    new InterfaceFunction("convertBack")
);

/**
 * ValueConverter Class 
 * Exposes a friendly interface for converting values between layers of abstraction.*/
export class ValueConverter {
    convert(value) { throw NotImplementedException(); }
    convertBack(value) { throw NotImplementedException(); }
}

/**
 * ValueValidator Class 
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export class ValueValidator {
    validate(value) { throw NotImplementedException(); }
}