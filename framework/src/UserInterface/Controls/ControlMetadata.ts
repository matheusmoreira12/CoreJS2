import { Control } from "./Control";
import { Class } from "../../Standard/Types/Types";
import { Collection } from "../../Standard/Collections/Collection";

export class ControlMetadata<TControl extends Control = any> {
    constructor(controlClass: Class<TControl>, qualifiedName: string, namespaceURI?: string | null) {
        this.__controlClass = controlClass;
        this.__namespaceURI = namespaceURI || null;
        this.__qualifiedName = qualifiedName;
        this.__activeInstances = new Collection();
    }

    get controlClass(): Class<TControl> { return this.__controlClass; }
    private __controlClass: Class<TControl>;

    get namespaceURI(): string | null { return this.__namespaceURI; }
    private __namespaceURI: string | null;

    get qualifiedName(): string { return this.__qualifiedName; }
    private __qualifiedName: string;

    get activeInstances(): Collection<TControl> { return this.__activeInstances; }
    private __activeInstances: Collection<TControl>;
}