import { Control } from "./Control";
import { Class } from "../../Standard/Types/Types";
import { Collection } from "../../Standard/Collections/Collection";

export class WidgetMetadata {
    constructor(widgetConstructor: Class<Control>, qualifiedName: string, namespaceURI?: string | null) {
        this.__widgetConstructor = widgetConstructor;
        this.__namespaceURI = namespaceURI || null;
        this.__qualifiedName = qualifiedName;
        this.__activeInstances = new Collection();
    }

    get controlConstructor(): Class<Control> { return this.__widgetConstructor; }
    private __widgetConstructor: Class<Control>;

    get namespaceURI(): string | null { return this.__namespaceURI; }
    private __namespaceURI: string | null;

    get qualifiedName(): string { return this.__qualifiedName; }
    private __qualifiedName: string;

    get activeInstances(): Collection<Control> { return this.__activeInstances; }
    private __activeInstances: Collection<Control>;
}