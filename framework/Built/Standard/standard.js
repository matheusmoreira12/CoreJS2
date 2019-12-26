"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("./exceptions");
const Enumeration_1 = require("./Enumeration");
const Events_1 = require("./Events");
const Interface_1 = require("./Interfaces/Interface");
class ServerTaskException extends exceptions_1.FrameworkException {
    constructor(serverMessage, serverErrorCode, message, innerException) {
        message = message || `Server task failed in the server side with status code $serverErrorCode and message "$serverMessage".`;
        super(message, innerException);
        this.data["serverMessage"] = serverMessage;
        this.data["serverErrorCode"] = serverErrorCode;
    }
}
exports.ServerTaskException = ServerTaskException;
const DEFAULT_SERVER_TASK_OPTIONS = {
    timeout: Number.POSITIVE_INFINITY,
    maxRetries: 0
};
exports.ServerTaskStatus = new Enumeration_1.Enumeration([
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
class ServerTask {
    constructor(promise) {
        this.__statusChangedEvent = new Events_1.BroadcastFrameworkEvent("ServerTask_statusChanged");
        this.__startedEvent = new Events_1.BroadcastFrameworkEvent("ServerTask_started");
        this.__finishedEvent = new Events_1.BroadcastFrameworkEvent("ServerTask_finished");
        this.__succeededEvent = new Events_1.BroadcastFrameworkEvent("ServerTask_succeeded");
        this.__failedEvent = new Events_1.BroadcastFrameworkEvent("ServerTask_failed");
        this.__status = exports.ServerTaskStatus.Pending;
        this.__error = null;
        if (!(promise instanceof Promise))
            throw new exceptions_1.ArgumentTypeException("promise", Promise);
        this.__loaded = new Promise((resolve, reject) => this._execute(promise, resolve, reject));
    }
    static get [Symbol.species]() { return Promise; }
    _execute(promise, resolve, reject) {
        function notifyStatus(status) {
            this._status = status;
            this.statusChangedEvent.broadcast(this, { status: status });
        }
        function notifyStart() {
            notifyStatus.call(this, exports.ServerTaskStatus.Started);
            this.startedEvent.broadcast(this, {});
        }
        function notifySuccess() {
            notifyStatus.call(this, exports.ServerTaskStatus.Succeeded);
            this.succeededEvent.broadcast(this, {});
            this.finishedEvent.broadcast(this, { error: null });
        }
        function notifyError(error) {
            notifyStatus.call(this, exports.ServerTaskStatus.Failed);
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
exports.ServerTask = ServerTask;
/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between layers of abstraction.*/
exports.IValueConverter = new Interface_1.Interface(new Interface_1.InterfaceMember("convert", Interface_1.InterfaceMemberType.Function), new Interface_1.InterfaceMember("convertBack", Interface_1.InterfaceMemberType.Function));
/**
 * ValueValidator Interface
 * Exposes a friendly interface for validating values between layers of abstraction.*/
exports.IValueValidator = new Interface_1.Interface(new Interface_1.InterfaceMember("validate", Interface_1.InterfaceMemberType.Function));
