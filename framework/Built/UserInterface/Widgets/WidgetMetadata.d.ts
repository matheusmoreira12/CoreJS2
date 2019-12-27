import { Widget } from "./Widget";
export declare type Constructor<T> = (...args: any[]) => T;
export declare class WidgetMetadata {
    constructor(widgetConstructor: Constructor<Widget>, namespaceURI: string, qualifiedName: string);
    readonly widgetClass: Constructor<Widget>;
    private __widgetConstructor;
    readonly namespaceURI: string;
    private __namespaceURI;
    readonly qualifiedName: string;
    private __qualifiedName;
}
