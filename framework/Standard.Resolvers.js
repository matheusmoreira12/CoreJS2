import * as Workers from "./Standard.Workers.js";
import { Enumeration } from "./Standard.Enumeration.js";

export const AsynchronousResolverStatus = new Enumeration([
    "Pending",
    "Resolved",
    "Rejected"
]);

class AsynchronousResolverWorker extends Workers.Worker {
    initialize() {
        let worker = this;
        this.promise = new Promise((resolve, reject) => {
            worker.resolve = resolve;
            worker.reject = reject;
        });
    }

    status = AsynchronousResolverStatus.Pending;

    //Exposed Methods
    get_resolved() {
        return this.promise;
    }

    do_resolve(value) {
        this.promise.resolve(value);

        this.status = AsynchronousResolverStatus.Resolved;
    }

    do_reject(error) {
        this.promise.reject(error);

        this.status = AsynchronousResolverStatus.Rejected;
    }
}

export class AsynchronousResolver extends Promise {
    get [Symbol.species]() { return Promise; }

    constructor() {
        Workers.Worker.create(this, AsynchronousResolverWorker);
    }
}