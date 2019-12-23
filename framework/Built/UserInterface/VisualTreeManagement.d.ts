import { ObservableCollection } from "../Standard/Collections";
export declare abstract class VisualTreeNode {
    constructor(domNode: Element);
    private __insertElement;
    private __removeElement;
    private __setAttribute;
    private __removeAttribute;
    private __childNodes_onChange;
    readonly childNodes: ObservableCollection<VisualTreeNode>;
    protected __childNodes: ObservableCollection<VisualTreeNode>;
    readonly domNode: Element;
    protected __domNode: Element;
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
