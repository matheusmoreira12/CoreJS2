declare class VisualTreeManager {
    constructor(target: any);
    elements: any;
    attachAll(): void;
    detachAll(): void;
}
export declare class Widget extends HTMLElement {
    constructor();
    _visualTreeManager: VisualTreeManager;
    _dragDropHandler: any;
    _fillVisualTree(manager: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    _dragDropHandler_onRequestDragStart(sender: any, args: any): void;
    _dragDropHandler_onDragStart(sender: any, args: any): void;
    _dragDropHandler_onDragMove(sender: any, args: any): void;
    _dragDropHandler_onDragEnd(sender: any, args: any): void;
    _dragDropHandler_onDragCancel(sender: any, args: any): void;
    _dragDropHandler_onDragEnter(sender: any, args: any): void;
    _dragDropHandler_onDragOver(sender: any, args: any): void;
    _dragDropHandler_onDragLeave(sender: any, args: any): void;
    _dragDropHandler_onDragDrop(sender: any, args: any): void;
    _onDragMove(sender: any, args: any): void;
    DragStartEvent: any;
    _onDragStart(sender: any, args: any): void;
    DragMoveEvent: any;
    _onDragEnd(sender: any, args: any): void;
    DragEndEvent: any;
    _onDragCancel(sender: any, args: any): void;
    DragCancelEvent: any;
    _onDragEnter(sender: any, args: any): void;
    DragEnterEvent: any;
    _onDragOver(sender: any, args: any): void;
    DragOverEvent: any;
    _onDragLeave(sender: any, args: any): void;
    DragLeaveEvent: any;
    _onDragDrop(sender: any, args: any): void;
    DragDropEvent: any;
    _onMouseEnter(sender: any, args: any): void;
    MouseEnterEvent: any;
    _onMouseLeave(sender: any, args: any): void;
    MouseLeaveEvent: any;
    _onMouseDown(sender: any, args: any): void;
    MouseDownEvent: any;
    _onMouseMove(sender: any, args: any): void;
    MouseMoveEvent: any;
    _onMouseUp(sender: any, args: any): void;
    MouseUpEvent: any;
    _onClick(sender: any, args: any): void;
    ClickEvent: any;
    static isMouseOverProperty: any;
    isMouseOver: any;
    static isDraggingProperty: any;
    isDragging: any;
    static isDragOverProperty: any;
    isDragOver: any;
    static isDraggableProperty: any;
    isDraggable: any;
}
/**
 * Content Presenter Definition
 */
export declare class JContentPresenter extends Widget {
    constructor();
    static contentProperty: any;
    content: any;
}
/**
 * Banner Widget Definition
 */
export declare const JBannerType: any;
export declare const ButtonIconPosition: any;
export declare class JButton extends Widget {
    constructor();
    static isDefaultProperty: any;
    isDefault: any;
    static valueProperty: any;
    value: any;
    static contentProperty: any;
    content: any;
    static iconProperty: any;
    icon: any;
}
export declare let DialogManager: {
    new (): {
        _openDialogs: any;
        showModal(options: any): Promise<unknown>;
    };
};
export declare let dialogManager: {
    _openDialogs: any;
    showModal(options: any): Promise<unknown>;
};
export {};
