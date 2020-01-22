import { WidgetMetadata, Widget } from "./index.js";
declare const WidgetManager: {
    readonly registeredWidgets: readonly WidgetMetadata[];
    getByName(qualifiedName: string, namespaceURI?: string | undefined): any;
    getByConstructor(widgetConstructor: new () => Widget): WidgetMetadata | undefined;
    register(widgetConstructor: new () => Widget, namespaceURI: string, qualifiedName: string): void;
    deregister(widgetConstructor: new () => Widget): void;
};
export default WidgetManager;
