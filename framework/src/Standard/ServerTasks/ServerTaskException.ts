import { FrameworkException } from "../Exceptions.js";

export class ServerTaskException extends FrameworkException {
    constructor(serverMessage?: string, serverErrorCode?: number, message?: string, innerException?: string) {
        message = message || `Server task failed in the server side with status code $serverErrorCode and message "$serverMessage".`;

        super(message, innerException);

        this.data.set("serverMessage", serverMessage);
        this.data.set("serverErrorCode", serverErrorCode);
    }
}
