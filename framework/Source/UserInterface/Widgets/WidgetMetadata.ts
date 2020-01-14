import { Widget } from "./index.js";

export class WidgetMetadata {
    constructor(widgetConstructor: new() => Widget, namespaceURI: string, qualifiedName: string) {
        this.__WidgetClass = widgetConstructor;
        this.__namespaceURI = namespaceURI;
        this.__qualifiedName = qualifiedName;
    }

    get WidgetClass(): new () => Widget { return this.__WidgetClass; }
    private __WidgetClass: new () => Widget;

    get namespaceURI(): string { return this.__namespaceURI; }
    private __namespaceURI: string;

    get qualifiedName(): string { return this.__qualifiedName; }
    private __qualifiedName: string;
}