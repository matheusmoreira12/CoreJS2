import { ArgumentTypeException, FrameworkException } from "./exceptions";
import { Enumeration } from "./Enumeration";
import { BroadcastFrameworkEvent } from "./Events";
import { Interface, InterfaceFunction } from "./Types/Types";

export class ServerTaskException extends FrameworkException {
    constructor(message?: string, innerException?: any) {
        super(message, innerException);
    }
}

export class ServerErrorException extends ServerTaskException {
    constructor(serverMessage?: string, serverErrorCode?: number, message?: string, innerException?: string) {
        super(message, innerException);

        this.data["serverMessage"] = serverMessage;
        this.data["serverErrorCode"] = serverErrorCode;
    }
}

export class ServerTaskTimedOutException extends ServerTaskException {
    constructor(message?: string, innerException?: any) {

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
    static get [Symbol.species]() { return Promise; }

    constructor(promise, options = DEFAULT_SERVER_TASK_OPTIONS) {
        if (!(promise instanceof Promise)) throw new ArgumentTypeException("promise", Promise);

        let { timeout, maxRetries } = options;
        this.__timeout = timeout;
        this.__maxRetries = maxRetries;

        this.__loaded = new Promise<any>((resolve, reject) => this._execute(promise, resolve, reject));
    }

    _execute(promise, resolve, reject) {
        let retries = 0;
        let timeoutHandle = null;

        function notifyStatus(status) {
            this._status = status;

            this.statusChangedEvent.broadcast(this, { status: status });
        }

        function notifyStart(this: ServerTask) {
            notifyStatus.call(this, ServerTaskStatus.Started);

            this.startedEvent.broadcast(this);
        }

        function notifyRetry(this: ServerTask, error, retries) {
            notifyStatus.call(this, ServerTaskStatus.Retried);

            this.__retries = retries;

            this.retriedEvent.broadcast(this, { error: error, retries: retries });
        }

        function notifyTimeout(this: ServerTask) {
            notifyStatus.call(this, ServerTaskStatus.TimedOut);

            this.timedOutEvent.broadcast(this);
        }

        function notifySuccess(this: ServerTask) {
            notifyStatus.call(this, ServerTaskStatus.Succeeded);

            this.succeededEvent.broadcast(this);
            this.finishedEvent.broadcast(this, { error: null });
        }

        function notifyError(this: ServerTask, error) {
            notifyStatus.call(this, ServerTaskStatus.Failed);

            this.__error = error;

            this.failedEvent.broadcast(this, { error: error });
            this.finishedEvent.broadcast(this);
        }

        function abort(this: ServerTask, error) {
            notifyError.call(this, error);

            reject(error);
        }

        function failed(this: ServerTask, error) {
            if (retries > this.__maxRetries || error instanceof ServerTaskError)
                abort.call(this, error);
            else
                retry.call(this, error);

            clearTimeout(timeoutHandle);
        }

        function succeeded(this: ServerTask, result) {
            notifySuccess.call(this);

            resolve(result);

            clearTimeout(timeoutHandle);
        }

        function timedOut(this: ServerTask) {
            notifyTimeout.call(this, ServerTaskStatus.TimedOut);

            failed.call(this, null);

            clearTimeout(timeoutHandle);
        }

        function retry(this: ServerTask, error) {
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

    private __timedOutEvent = new BroadcastFrameworkEvent("ServerTask_timedOut");
    private __retriedEvent = new BroadcastFrameworkEvent("ServerTask_retried");
    private __statusChangedEvent = new BroadcastFrameworkEvent("ServerTask_statusChanged");
    private __startedEvent = new BroadcastFrameworkEvent("ServerTask_started");
    private __finishedEvent = new BroadcastFrameworkEvent("ServerTask_finished");
    private __succeededEvent = new BroadcastFrameworkEvent("ServerTask_succeeded");
    private __failedEvent = new BroadcastFrameworkEvent("ServerTask_failed");

    private __status = ServerTaskStatus.Pending;
    private __error = null;
    private __maxRetries: number;
    private __retries: number;
    private __timeout: number;

    private __loaded: Promise<any>;

    get timedOutEvent() { return this.__timedOutEvent; }
    get retriedEvent() { return this.__retriedEvent; }
    get statusChangedEvent() { return this.__statusChangedEvent; }
    get startedEvent() { return this.__startedEvent; }
    get finishedEvent() { return this.__finishedEvent; }
    get succeededEvent() { return this.__succeededEvent; }
    get failedEvent() { return this.__failedEvent; }

    get status() { return this.__status; }
    get error() { return this.__error; }
    get loaded() { return this.__loaded };
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