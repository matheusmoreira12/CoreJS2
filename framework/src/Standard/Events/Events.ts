import { FrameworkEvent } from "./FrameworkEvent.js";
import { InvalidTypeException, InvalidOperationException } from "../Exceptions.js";

export type FrameworkEventListener<TArgs extends object> = (sender: any, args: TArgs) => void;

export class FrameworkEventArgs {
    acceptDrag() {
        throw new Error("Method not implemented.");
    }
    static get Empty() { return new FrameworkEventArgs(); }

    isHandled: boolean = false;
}