import { Widget } from "./Widget";

export type Constructor<T> = (...args: any[]) => T;

export class WidgetMetadata {
    constructor(widgetConstructor: Constructor<Widget>, namespaceURI: string, qualifiedName: string) {
        this.__widgetConstructor = widgetConstructor;
        this.__namespaceURI = namespaceURI;
        this.__qualifiedName = qualifiedName;
    }

    get widgetClass(): Constructor<Widget> { return this.__widgetConstructor; }
    private __widgetConstructor: Constructor<Widget>;

    get namespaceURI(): string { return this.__namespaceURI; }
    private __namespaceURI: string;

    get qualifiedName(): string { return this.__qualifiedName; }
    private __qualifiedName: string;
}