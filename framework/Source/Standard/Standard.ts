import { ArgumentTypeException, FrameworkException } from "./exceptions";
import { Enumeration } from "./Enumeration";
import { BroadcastFrameworkEvent } from "./Events";
import { Interface, InterfaceMember, InterfaceMemberType } from "./Interfaces/Interface";

export class ServerTaskException extends FrameworkException {
    constructor(serverMessage?: string, serverErrorCode?: number, message?: string, innerException?: string) {
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
    static get [Symbol.species]() { return Promise; }

    constructor(promise) {
        if (!(promise instanceof Promise)) throw new ArgumentTypeException("promise", Promise);

        this.__loaded = new Promise<any>((resolve, reject) => this._execute(promise, resolve, reject));
    }

    _execute(promise, resolve, reject) {
        function notifyStatus(status) {
            this._status = status;

            this.statusChangedEvent.broadcast(this, { status: status });
        }

        function notifyStart(this: ServerTask) {
            notifyStatus.call(this, ServerTaskStatus.Started);

            this.startedEvent.broadcast(this, {});
        }

        function notifySuccess(this: ServerTask) {
            notifyStatus.call(this, ServerTaskStatus.Succeeded);

            this.succeededEvent.broadcast(this, {});
            this.finishedEvent.broadcast(this, { error: null });
        }

        function notifyError(this: ServerTask, error) {
            notifyStatus.call(this, ServerTaskStatus.Failed);

            this.__error = error;

            this.failedEvent.broadcast(this, { error: error });
            this.finishedEvent.broadcast(this, {});
        }

        function failed(this: ServerTask, error) {
            notifyError.call(this, error);
            reject(error);
        }

        function succeeded(this: ServerTask, result) {
            notifySuccess.call(this);
            resolve(result);
        }

        promise.then(value => { //Fulfilled
            succeeded.call(this, value);
        }, reason => { //Rejected
            failed.call(this, reason);
        });

        notifyStart.call(this);
    }

    private __statusChangedEvent = new BroadcastFrameworkEvent("ServerTask_statusChanged");
    private __startedEvent = new BroadcastFrameworkEvent("ServerTask_started");
    private __finishedEvent = new BroadcastFrameworkEvent("ServerTask_finished");
    private __succeededEvent = new BroadcastFrameworkEvent("ServerTask_succeeded");
    private __failedEvent = new BroadcastFrameworkEvent("ServerTask_failed");

    private __status = ServerTaskStatus.Pending;
    private __error = null;

    private __loaded: Promise<any>;

    get statusChangedEvent() { return this.__statusChangedEvent; }
    get startedEvent() { return this.__startedEvent; }
    get finishedEvent() { return this.__finishedEvent; }
    get succeededEvent() { return this.__succeededEvent; }
    get failedEvent() { return this.__failedEvent; }

    get status() { return this.__status; }
    get error() { return this.__error; }
    get loaded() { return this.__loaded };
}

/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between layers of abstraction.*/
export const IValueConverter = new Interface(
    new InterfaceMember("convert", InterfaceMemberType.Function),
    new InterfaceMember("convertBack", InterfaceMemberType.Function)
);

/**
 * ValueValidator Interface 
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export const IValueValidator = new Interface(
    new InterfaceMember("validate", InterfaceMemberType.Function)
);