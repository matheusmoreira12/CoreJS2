import { Control } from "./Control";
import { Class } from "../../Standard/Types/Types";
import { Collection } from "../../Standard/Collections/Collection";

export class ControlMetadata {
    constructor(widgetConstructor: Class<Control>, qualifiedName: string, namespaceURI?: string | null) {
        this.__controlClass = widgetConstructor;
        this.__namespaceURI = namespaceURI || null;
        this.__qualifiedName = qualifiedName;
        this.__activeInstances = new Collection();
    }

    get controlClass(): Class<Control> { return this.__controlClass; }
    private __controlClass: Class<Control>;

    get namespaceURI(): string | null { return this.__namespaceURI; }
    private __namespaceURI: string | null;

    get qualifiedName(): string { return this.__qualifiedName; }
    private __qualifiedName: string;

    get activeInstances(): Collection<Control> { return this.__activeInstances; }
    private __activeInstances: Collection<Control>;
}