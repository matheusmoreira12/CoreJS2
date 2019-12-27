import { WidgetMetadata } from "./WidgetMetadata";
import { Widget } from "./Widget";
declare const WidgetManager: {
    readonly registeredWidgets: readonly WidgetMetadata[];
    getByName(qualifiedName: string, namespaceURI?: string): WidgetMetadata;
    getByConstructor(widgetConstructor: new () => Widget): WidgetMetadata;
    register(widgetConstructor: new () => Widget, namespaceURI: string, qualifiedName: string): void;
    deregister(widgetConstructor: new () => Widget): void;
};
export default WidgetManager;
