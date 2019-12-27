import { WidgetMetadata, Constructor } from "./WidgetMetadata";
import { Widget } from "./Widget";
declare const WidgetManager: {
    readonly registeredWidgets: Generator<WidgetMetadata, any, unknown>;
    register(widgetConstructor: Constructor<Widget>, namespaceURI: string, qualifiedName: string): void;
    deregister(widgetConstructor: Constructor<Widget>): void;
};
export default WidgetManager;
