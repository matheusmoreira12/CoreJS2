import { Control } from "./Control.js";
import { Class } from "../../Standard/Types/Types.js";
import { Collection } from "../../Standard/Collections/Collection.js";
import { NodeName } from "../Markup/NodeName.js";

export class ControlMetadata<TControl extends Control = any> {
    constructor(controlClass: Class<TControl>, name: string) {
        this.__controlClass = controlClass;
        this.__name = new NodeName(name);
        this.__activeInstances = new Collection();
    }

    get controlClass(): Class<TControl> { return this.__controlClass; }
    private __controlClass: Class<TControl>;

    get name(): NodeName { return this.__name; }
    private __name: NodeName;

    get activeInstances(): Collection<TControl> { return this.__activeInstances; }
    private __activeInstances: Collection<TControl>;
}