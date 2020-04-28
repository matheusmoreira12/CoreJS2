import { FrameworkException } from "../Standard/index.js";

export class AjaxRequestFailedException extends FrameworkException {
    constructor(status: number, statusText: string, message?: string, innerException?: Error) {
        message = message || "";
        super(message, innerException);

        this.data.set("status", status);
        this.data.set("statusText", statusText);
    }
}