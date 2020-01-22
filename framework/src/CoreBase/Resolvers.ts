export class AsynchronousResolver {
    resolved: Promise<unknown>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
    static get STATUS_REJECTED() { return -1; }
    static get STATUS_PENDING() { return 0; }
    static get STATUS_RESOLVED() { return 1; }

    constructor() {
        let self = this;
        this.resolved = new Promise((resolve, reject) => {
            self.resolve = function (value) {
                resolve(value);
                this.status = AsynchronousResolver.STATUS_RESOLVED;
            }

            self.reject = function (error) {
                reject(error);
                this.status = AsynchronousResolver.STATUS_REJECTED;
            }
        });
    }

    status = AsynchronousResolver.STATUS_PENDING;
}