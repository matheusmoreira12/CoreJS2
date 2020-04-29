import { FrameworkException } from "../Standard/Exceptions/index.js"
import { AjaxMethod } from "./AjaxMethod.js";

export class AjaxRequestFailedException extends FrameworkException {
    constructor(method: number, url: string, status: number, statusText: string, message?: string, innerException?: Error) {
        message = message || 'The {"method"} request to "{"url"}" failed with status {"status"} ({"statusText"}).';
        super(message, innerException);

        this.__data.set("method", AjaxMethod.getLabel(method)!);
        this.__data.set("url", url);
        this.__data.set("status", status);
        this.__data.set("statusText", statusText);
    }
}