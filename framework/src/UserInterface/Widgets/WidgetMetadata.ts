import { Widget } from "./Widget";
import { Class } from "../../Standard/Types/Types";
import { Collection } from "../../Standard/Collections/Collection";

export class WidgetMetadata {
    constructor(widgetConstructor: Class<Widget>, qualifiedName: string, namespaceURI?: string | null) {
        this.__widgetConstructor = widgetConstructor;
        this.__namespaceURI = namespaceURI || null;
        this.__qualifiedName = qualifiedName;
        this.__activeInstances = new Collection();
    }

    get widgetConstructor(): Class<Widget> { return this.__widgetConstructor; }
    private __widgetConstructor: Class<Widget>;

    get namespaceURI(): string | null { return this.__namespaceURI; }
    private __namespaceURI: string | null;

    get qualifiedName(): string { return this.__qualifiedName; }
    private __qualifiedName: string;

    get activeInstances(): Collection<Widget> { return this.__activeInstances; }
    private __activeInstances: Collection<Widget>;
}