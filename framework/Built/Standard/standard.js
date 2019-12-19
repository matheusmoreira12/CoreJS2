import { ArgumentTypeException, FrameworkException } from "./exceptions";
import { Enumeration } from "./Enumeration";
import { BroadcastFrameworkEvent } from "./Events";
import { Interface, InterfaceFunction } from "./Types/Types";
export class ServerTaskException extends FrameworkException {
    constructor(message, innerException) {
        super(message, innerException);
    }
}
export class ServerErrorException extends ServerTaskException {
    constructor(serverMessage, serverErrorCode, message, innerException) {
        super(message, innerException);
        this.data["serverMessage"] = serverMessage;
        this.data["serverErrorCode"] = serverErrorCode;
    }
}
export class ServerTaskTimedOutException extends ServerTaskException {
    constructor(message, innerException) {
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
export class ServerTask {
    constructor(promise, options = DEFAULT_SERVER_TASK_OPTIONS) {
        this.__timedOutEvent = new BroadcastFrameworkEvent("ServerTask_timedOut");
        this.__retriedEvent = new BroadcastFrameworkEvent("ServerTask_retried");
        this.__statusChangedEvent = new BroadcastFrameworkEvent("ServerTask_statusChanged");
        this.__startedEvent = new BroadcastFrameworkEvent("ServerTask_started");
        this.__finishedEvent = new BroadcastFrameworkEvent("ServerTask_finished");
        this.__succeededEvent = new BroadcastFrameworkEvent("ServerTask_succeeded");
        this.__failedEvent = new BroadcastFrameworkEvent("ServerTask_failed");
        this.__status = ServerTaskStatus.Pending;
        this.__error = null;
        if (!(promise instanceof Promise))
            throw new ArgumentTypeException("promise", Promise);
        let { timeout, maxRetries } = options;
        this.__timeout = timeout;
        this.__maxRetries = maxRetries;
        this.__loaded = new Promise((resolve, reject) => this._execute(promise, resolve, reject));
    }
    static get [Symbol.species]() { return Promise; }
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
            this.__retries = retries;
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
            this.__error = error;
            this.failedEvent.broadcast(this, { error: error });
            this.finishedEvent.broadcast(this);
        }
        function abort(error) {
            notifyError.call(this, error);
            reject(error);
        }
        function failed(error) {
            if (retries > this.__maxRetries || error instanceof ServerTaskError)
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
            promise.then(value => {
                succeeded.call(this, value);
            }, reason => {
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
    get timedOutEvent() { return this.__timedOutEvent; }
    get retriedEvent() { return this.__retriedEvent; }
    get statusChangedEvent() { return this.__statusChangedEvent; }
    get startedEvent() { return this.__startedEvent; }
    get finishedEvent() { return this.__finishedEvent; }
    get succeededEvent() { return this.__succeededEvent; }
    get failedEvent() { return this.__failedEvent; }
    get status() { return this.__status; }
    get error() { return this.__error; }
    get loaded() { return this.__loaded; }
    ;
    get maxRetries() { return this.__maxRetries; }
    get retries() { return this.__retries; }
    get timeout() { return this.__timeout; }
}
/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between layers of abstraction.*/
export const IValueConverter = new Interface([
    new InterfaceFunction("convert"),
    new InterfaceFunction("convertBack")
]);
/**
 * ValueValidator Interface
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export const IValueValidator = new Interface([
    new InterfaceFunction("validate")
]);
