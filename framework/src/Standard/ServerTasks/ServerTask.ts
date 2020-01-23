import { ArgumentTypeException } from "../Exceptions";
import { Enumeration } from "../Enumeration";
import { BroadcastFrameworkEvent } from "../Events/index";

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
export class ServerTask<TResult> {
    static get [Symbol.species]() { return Promise; }

    constructor(promise: Promise<TResult>) {
        if (!(promise instanceof Promise)) throw new ArgumentTypeException("promise", Promise);

        this.__loaded = new Promise((resolve, reject) => this._execute(promise, resolve, reject));
    }

    _execute(promise: Promise<TResult>, resolve: (value: TResult | PromiseLike<TResult>) => void, reject: (reason: any) => void) {
        function notifyStatus(this: ServerTask<TResult>, status: number) {
            this.__status = status;

            this.__statusChangedEvent.broadcast(this, { status: status });
        }

        function notifyStart(this: ServerTask<TResult>) {
            notifyStatus.call(this, ServerTaskStatus.Started);

            this.startedEvent.broadcast(this, {});
        }

        function notifySuccess(this: ServerTask<TResult>) {
            notifyStatus.call(this, ServerTaskStatus.Succeeded);

            this.succeededEvent.broadcast(this, {});
            this.finishedEvent.broadcast(this, { error: null });
        }

        function notifyError(this: ServerTask<TResult>, error: any) {
            notifyStatus.call(this, ServerTaskStatus.Failed);

            this.__error = error;

            this.failedEvent.broadcast(this, { error: error });
            this.finishedEvent.broadcast(this, {});
        }

        function failed(this: ServerTask<TResult>, error: any) {
            notifyError.call(this, error);
            reject(error);
        }

        function succeeded(this: ServerTask<TResult>, result: TResult) {
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

    private __loaded: Promise<TResult>;

    get statusChangedEvent() { return this.__statusChangedEvent; }
    get startedEvent() { return this.__startedEvent; }
    get finishedEvent() { return this.__finishedEvent; }
    get succeededEvent() { return this.__succeededEvent; }
    get failedEvent() { return this.__failedEvent; }

    get status() { return this.__status; }
    get error() { return this.__error; }
    get loaded() { return this.__loaded };
}