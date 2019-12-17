export declare class VisualTreeNode {
    constructor(domNode: any);
    _insertElement(treeNode: any, index: any): void;
    _removeElement(treeNode: any): void;
    _setAttribute(treeNode: any): void;
    _removeAttribute(treeNode: any): void;
    _childNodes_onChange(sender: any, args: any): void;
    childNodes: any;
}
export declare class VisualTreeElement extends VisualTreeNode {
    constructor(qualifiedName: any, namespaceURI?: any);
}
export declare class VisualTreeAttribute extends VisualTreeNode {
    constructor(qualifiedName: any, namespaceURI?: any);
}
export declare class VisualTree extends VisualTreeNode {
    constructor(rootNode: any);
    applyTemplate(template: any): Promise<void>;
}
