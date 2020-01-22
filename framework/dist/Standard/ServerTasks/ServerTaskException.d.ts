import { FrameworkException } from "../Exceptions.js";
export declare class ServerTaskException extends FrameworkException {
    constructor(serverMessage?: string, serverErrorCode?: number, message?: string, innerException?: string);
}
