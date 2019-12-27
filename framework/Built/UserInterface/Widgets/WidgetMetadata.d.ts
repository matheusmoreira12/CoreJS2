import { Widget } from "./Widget";
export declare class WidgetMetadata {
    constructor(widgetConstructor: new () => Widget, namespaceURI: string, qualifiedName: string);
    readonly WidgetClass: new () => Widget;
    private __WidgetClass;
    readonly namespaceURI: string;
    private __namespaceURI;
    readonly qualifiedName: string;
    private __qualifiedName;
}
