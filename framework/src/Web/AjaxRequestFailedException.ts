import { FrameworkException } from "../Standard/index.js";

export class AjaxRequestFailedException extends FrameworkException {
    constructor(method: number, url: string, status: number, statusText: string, message?: string, innerException?: Error) {
        message = message || 'The request failed with status {"status"} ({"statusText"}).';
        super(message, innerException);

        this.data.set("method", method);
        this.data.set("url", url);
        this.data.set("status", status);
        this.data.set("statusText", statusText);
    }
}