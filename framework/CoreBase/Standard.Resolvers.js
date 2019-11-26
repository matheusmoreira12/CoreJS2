export class AsynchronousResolver extends Promise {
    static get STATUS_PENDING() { return 0; }
    static get STATUS_RESOLVED() { return 1; }
    static get STATUS_REJECTED() { return 2; }

    constructor() {
        let self = this;
        this.resolved = new Promise((resolve, reject) => {
            self.resolve = resolve;
            self.reject = reject;
        });

        Workers.Worker.create(this, AsynchronousResolverWorker);
    }

    resolve(value) {
        this.promise.resolve(value);

        this.status = AsynchronousResolver.STATUS_RESOLVED;
    }

    reject(error) {
        this.promise.reject(error);

        this.status = AsynchronousResolver.STATUS_REJECTED;
    }

    status = AsynchronousResolver.STATUS_PENDING;
}