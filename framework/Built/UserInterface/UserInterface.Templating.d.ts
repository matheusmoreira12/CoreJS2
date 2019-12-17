export declare class VisualTemplateNode {
    constructor();
    readonly childNodes: any;
}
export declare class VisualTemplateElement extends VisualTemplateNode {
    constructor(qualifiedName: any, namespaceUri?: any);
    readonly qualifiedName: any;
    readonly namespaceUri: any;
    readonly properties: any;
}
export declare class VisualTemplate extends VisualTemplateNode {
    constructor();
}
export declare class VisualTemplateBinding {
    constructor(options?: any);
}
export declare class VisualTemplatePropertyBinding extends VisualTemplateBinding {
    constructor(sourceName: any, sourcePropertyName: any, targetName: any, targetPropertyName: any, options?: any);
}
export declare class VisualTemplatePropertyAttributeBinding extends VisualTemplateBinding {
    constructor(sourceName: any, sourcePropertyName: any, targetElementName: any, targetAttributeName: any, options?: any);
}
