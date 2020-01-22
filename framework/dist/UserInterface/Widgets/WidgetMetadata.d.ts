import { Widget } from "./index.js";
export declare class WidgetMetadata {
    constructor(widgetConstructor: new () => Widget, namespaceURI: string, qualifiedName: string);
    get WidgetClass(): new () => Widget;
    private __WidgetClass;
    get namespaceURI(): string;
    private __namespaceURI;
    get qualifiedName(): string;
    private __qualifiedName;
}
