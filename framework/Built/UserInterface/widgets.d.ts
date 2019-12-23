import { Collection } from "../Standard/Collections";
import DragDropHandler from "./DragDropHandler";
import { FrameworkEvent, NativeEvent } from "../Standard/Events";
import { FrameworkProperty } from "./user-interface";
import { Enumeration } from "../Standard/Enumeration";
declare class VisualTreeManager {
    constructor(target: Widget);
    attachAll(): void;
    detachAll(): void;
    private __target;
    private __elements;
}
export declare class Widget extends HTMLElement {
    constructor();
    _visualTreeManager: VisualTreeManager;
    _dragDropHandler: DragDropHandler;
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
    DragStartEvent: FrameworkEvent;
    _onDragStart(sender: any, args: any): void;
    DragMoveEvent: FrameworkEvent;
    _onDragEnd(sender: any, args: any): void;
    DragEndEvent: FrameworkEvent;
    _onDragCancel(sender: any, args: any): void;
    DragCancelEvent: FrameworkEvent;
    _onDragEnter(sender: any, args: any): void;
    DragEnterEvent: FrameworkEvent;
    _onDragOver(sender: any, args: any): void;
    DragOverEvent: FrameworkEvent;
    _onDragLeave(sender: any, args: any): void;
    DragLeaveEvent: FrameworkEvent;
    _onDragDrop(sender: any, args: any): void;
    DragDropEvent: FrameworkEvent;
    _onMouseEnter(sender: any, args: any): void;
    MouseEnterEvent: NativeEvent;
    _onMouseLeave(sender: any, args: any): void;
    MouseLeaveEvent: NativeEvent;
    _onMouseDown(sender: any, args: any): void;
    MouseDownEvent: NativeEvent;
    _onMouseMove(sender: any, args: any): void;
    MouseMoveEvent: NativeEvent;
    _onMouseUp(sender: any, args: any): void;
    MouseUpEvent: NativeEvent;
    _onClick(sender: any, args: any): void;
    ClickEvent: NativeEvent;
    static isMouseOverProperty: FrameworkProperty;
    isMouseOver: any;
    static isDraggingProperty: FrameworkProperty;
    isDragging: any;
    static isDragOverProperty: FrameworkProperty;
    isDragOver: any;
    static isDraggableProperty: FrameworkProperty;
    isDraggable: any;
}
/**
 * Content Presenter Definition
 */
export declare class JContentPresenter extends Widget {
    constructor();
    static contentProperty: FrameworkProperty;
    content: any;
}
/**
 * Banner Widget Definition
 */
export declare const JBannerType: Enumeration<import("../Standard/Enumeration").EnumerationValue>;
export declare const ButtonIconPosition: Enumeration<import("../Standard/Enumeration").EnumerationValue>;
export declare class JButton extends Widget {
    constructor();
    static isDefaultProperty: FrameworkProperty;
    isDefault: any;
    static valueProperty: FrameworkProperty;
    value: any;
    static contentProperty: FrameworkProperty;
    content: any;
    static iconProperty: FrameworkProperty;
    icon: any;
}
export declare let DialogManager: {
    new (): {
        _openDialogs: Collection<unknown>;
        showModal(options: any): Promise<unknown>;
    };
};
export declare let dialogManager: {
    _openDialogs: Collection<unknown>;
    showModal(options: any): Promise<unknown>;
};
export {};
