import { ObservableCollection } from "../Standard/Collections/ObservableCollection.js";
export declare abstract class VisualTreeNode {
    constructor(domNode: Node);
    private __insertElement;
    private __removeElement;
    private __setAttribute;
    private __removeAttribute;
    private __childNodes_onChange;
    get childNodes(): ObservableCollection<VisualTreeNode>;
    protected __childNodes: ObservableCollection<VisualTreeNode>;
    get domNode(): Node;
    protected __domNode: Node;
}
export declare class VisualTreeElement extends VisualTreeNode {
    constructor(qualifiedName: any, namespaceURI?: null);
}
export declare class VisualTreeAttribute extends VisualTreeNode {
    constructor(qualifiedName: any, namespaceURI?: null);
}
export declare class VisualTree extends VisualTreeNode {
    constructor(rootNode: any);
}
