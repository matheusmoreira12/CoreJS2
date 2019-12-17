var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
import { ObservableCollection, ObservableCollectionChangeAction } from "./Standard.Collections.js";
import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "./exceptions.js";
import { PropertyBinding, PropertyAttributeBinding } from "./UserInterface.Bindings.js";
const DEFAULT_NAMESPACE_URI = "http://www.w3.org/1999/xhtml";
export class VisualTreeNode {
    constructor(domNode) {
        this.childNodes = new ObservableCollection();
        if (this.constructor === VisualTreeNode)
            throw new InvalidOperationException("Invalid constructor.");
        if (!(domNode instanceof Node))
            throw new ArgumentTypeException("domNode", domNode, Node);
        this.domNode = domNode;
        this.childNodes.ChangeEvent.attach(this._childNodes_onChange, this);
    }
    _insertElement(treeNode, index) {
        let domChildNodes = this.domNode.childNodes;
        if (domChildNodes.length > index) {
            let refNode = domChildNodes[index];
            this.domNode.insertBefore(treeNode.domNode, refNode);
        }
        else
            this.domNode.appendChild(treeNode.domNode);
    }
    _removeElement(treeNode) {
        treeNode.domNode.remove();
    }
    _setAttribute(treeNode) {
        this.domNode.setAttributeNodeNS(treeNode.domNode);
    }
    _removeAttribute(treeNode) {
        this.domNode.removeAttributeNode(treeNode.domNode);
    }
    _childNodes_onChange(sender, args) {
        if (Enumeration.isFlagSet(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeNode) {
                    if (item instanceof VisualTreeElement)
                        this._removeElement(item);
                    else if (item instanceof VisualTreeAttribute)
                        this._removeAttribute(item);
                }
                else
                    throw InvalidTypeException("item", item, VisualTreeNode);
            }
        }
        if (Enumeration.isFlagSet(ObservableCollectionChangeAction.Add, args.action)) {
            let index = args.newIndex;
            for (let item of args.newItems) {
                if (item instanceof VisualTreeNode) {
                    if (item instanceof VisualTreeElement)
                        this._insertElement(item, index);
                    else if (item instanceof VisualTreeAttribute)
                        this._setAttribute(item, index);
                }
                else
                    throw InvalidTypeException("item", item, VisualTreeNode);
                index++;
            }
        }
    }
}
export class VisualTreeElement extends VisualTreeNode {
    constructor(qualifiedName, namespaceURI = null) {
        namespaceURI = namespaceURI || DEFAULT_NAMESPACE_URI;
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);
        let domElement = document.createElementNS(namespaceURI, qualifiedName);
        super(domElement);
    }
}
export class VisualTreeAttribute extends VisualTreeNode {
    constructor(qualifiedName, namespaceURI = null) {
        namespaceURI = namespaceURI || DEFAULT_NAMESPACE_URI;
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);
        let domAttribute = document.createAttributeNS(namespaceURI, qualifiedName);
        super(domAttribute);
    }
}
export class VisualTree extends VisualTreeNode {
    constructor(rootNode) {
        super(rootNode);
    }
    applyTemplate(template) {
        return __awaiter(this, void 0, void 0, function* () {
            function applyBinding(tempBinding) {
                return __awaiter(this, void 0, void 0, function* () {
                    for (let tempBinding of tempBindings) {
                        if (tempBinding instanceof VisualTemplatePropertyBinding) {
                            let source = yield ReferenceSystem.retrieve(tempBinding.sourceName, context);
                            let sourceProperty = yield ReferenceSystem.retrieve(tempBinding.sourcePropertyName, context);
                            let target = yield ReferenceSystem.retrieve(tempBinding.targetName, context);
                            let targetProperty = yield ReferenceSystem.retrieve(tempBinding.targetPropertyName, context);
                            return new PropertyBinding(source, sourceProperty, target, targetProperty, tempBinding.options);
                        }
                        else if (tempBinding instanceof VisualTemplatePropertyAttributeBinding) {
                            let source = yield ReferenceSystem.retrieve(tempBinding.sourceName, context);
                            let sourceProperty = yield ReferenceSystem.retrieve(tempBinding.sourcePropertyName, context);
                            let targetNode = yield ReferenceSystem.retrieve(tempBinding.targetqualifiedName, context);
                            return new PropertyAttributeBinding(source, sourceProperty, targetNode, tempBinding.targetAttributeName, tempBinding.options);
                        }
                    }
                    return null;
                });
            }
            function applyBindings(tempBindings) {
                return __asyncGenerator(this, arguments, function* applyBindings_1() {
                    for (let tempBinding of tempBindings)
                        yield yield __await(yield __await(applyBinding(tempBinding)));
                });
            }
            function applyNode(tempNode) {
                return __awaiter(this, void 0, void 0, function* () {
                    ReferenceSystem.deriveContext();
                    if (tempNode instanceof VisualTemplateNode) {
                        if (tempNode instanceof VisualTemplateElement) {
                            for (let childNode of yield applyNodes(tempNode.children))
                                domNode.appendChild(domChild);
                        }
                    }
                    else
                        throw new InvalidTypeException("tempNode", tempNode, VisualTemplateNode);
                    ReferenceSystem.freeContext();
                    return domNode;
                });
            }
            function applyNodes(tempNodes) {
                return __asyncGenerator(this, arguments, function* applyNodes_1() {
                    for (let tempNode of tempNodes) {
                        let domNode = yield __await(applyNode(tempNode));
                        if (tempNode.name)
                            ReferenceSystem.declare(tempNode.name, domNode);
                        yield yield __await(domNode);
                    }
                });
            }
            for (let node of yield applyNodes())
                this.childNodes.add(node);
        });
    }
}
window.VisualTree = VisualTree;
window.VisualTreeElement = VisualTreeElement;
window.VisualTreeAttribute = VisualTreeAttribute;
