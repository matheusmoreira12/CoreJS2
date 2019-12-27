export class WidgetMetadata {
    constructor(widgetConstructor, namespaceURI, qualifiedName) {
        this.__widgetConstructor = widgetConstructor;
        this.__namespaceURI = namespaceURI;
        this.__qualifiedName = qualifiedName;
    }
    get widgetClass() { return this.__widgetConstructor; }
    get namespaceURI() { return this.__namespaceURI; }
    get qualifiedName() { return this.__qualifiedName; }
}
