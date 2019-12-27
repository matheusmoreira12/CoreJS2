export class AsynchronousResolver {
    constructor() {
        this.status = AsynchronousResolver.STATUS_PENDING;
        let self = this;
        this.resolved = new Promise((resolve, reject) => {
            self.resolve = function (value) {
                resolve(value);
                this.status = AsynchronousResolver.STATUS_RESOLVED;
            };
            self.reject = function (error) {
                reject(error);
                this.status = AsynchronousResolver.STATUS_REJECTED;
            };
        });
    }
    static get STATUS_REJECTED() { return -1; }
    static get STATUS_PENDING() { return 0; }
    static get STATUS_RESOLVED() { return 1; }
}
