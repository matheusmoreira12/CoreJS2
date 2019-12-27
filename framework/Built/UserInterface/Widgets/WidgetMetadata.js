export class WidgetMetadata {
    constructor(widgetConstructor, namespaceURI, qualifiedName) {
        this.__WidgetClass = widgetConstructor;
        this.__namespaceURI = namespaceURI;
        this.__qualifiedName = qualifiedName;
    }
    get WidgetClass() { return this.__WidgetClass; }
    get namespaceURI() { return this.__namespaceURI; }
    get qualifiedName() { return this.__qualifiedName; }
}
