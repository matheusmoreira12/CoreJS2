import { Collection } from "../../Standard/Collections/index.js";
import { Control } from "./index.js";
import { Class } from "../../Standard/Types/Types.js";

type ControlMetadata = {
    elementName: string;
    ctor: Class<Control>;
    instances: Collection<Control>;
}

namespace ControlMetadata {
    export function create(): ControlMetadata {
        return {
            instances: new Collection()
        };
    }
}

export function register() {

}

export function unregister() {

}