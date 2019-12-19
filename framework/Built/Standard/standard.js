import { ArgumentTypeException, FrameworkException } from "./exceptions";
import { Enumeration } from "./Enumeration";
import { BroadcastFrameworkEvent } from "./Events";
import { Interface, InterfaceFunction } from "./Types/Types";
export class ServerTaskException extends FrameworkException {
    constructor(serverMessage, serverErrorCode, message, innerException) {
        message = message || `Server task failed in the server side with status code $serverErrorCode and message "$serverMessage".`;
        super(message, innerException);
        this.data["serverMessage"] = serverMessage;
        this.data["serverErrorCode"] = serverErrorCode;
    }
}
const DEFAULT_SERVER_TASK_OPTIONS = {
    timeout: Number.POSITIVE_INFINITY,
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
    constructor(promise) {
        this.__statusChangedEvent = new BroadcastFrameworkEvent("ServerTask_statusChanged");
        this.__startedEvent = new BroadcastFrameworkEvent("ServerTask_started");
        this.__finishedEvent = new BroadcastFrameworkEvent("ServerTask_finished");
        this.__succeededEvent = new BroadcastFrameworkEvent("ServerTask_succeeded");
        this.__failedEvent = new BroadcastFrameworkEvent("ServerTask_failed");
        this.__status = ServerTaskStatus.Pending;
        this.__error = null;
        if (!(promise instanceof Promise))
            throw new ArgumentTypeException("promise", Promise);
        this.__loaded = new Promise((resolve, reject) => this._execute(promise, resolve, reject));
    }
    static get [Symbol.species]() { return Promise; }
    _execute(promise, resolve, reject) {
        function notifyStatus(status) {
            this._status = status;
            this.statusChangedEvent.broadcast(this, { status: status });
        }
        function notifyStart() {
            notifyStatus.call(this, ServerTaskStatus.Started);
            this.startedEvent.broadcast(this, {});
        }
        function notifySuccess() {
            notifyStatus.call(this, ServerTaskStatus.Succeeded);
            this.succeededEvent.broadcast(this, {});
            this.finishedEvent.broadcast(this, { error: null });
        }
        function notifyError(error) {
            notifyStatus.call(this, ServerTaskStatus.Failed);
            this.__error = error;
            this.failedEvent.broadcast(this, { error: error });
            this.finishedEvent.broadcast(this, {});
        }
        function failed(error) {
            notifyError.call(this, error);
            reject(error);
        }
        function succeeded(result) {
            notifySuccess.call(this);
            resolve(result);
        }
        promise.then(value => {
            succeeded.call(this, value);
        }, reason => {
            failed.call(this, reason);
        });
        notifyStart.call(this);
    }
    get statusChangedEvent() { return this.__statusChangedEvent; }
    get startedEvent() { return this.__startedEvent; }
    get finishedEvent() { return this.__finishedEvent; }
    get succeededEvent() { return this.__succeededEvent; }
    get failedEvent() { return this.__failedEvent; }
    get status() { return this.__status; }
    get error() { return this.__error; }
    get loaded() { return this.__loaded; }
    ;
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
