﻿import { Collection } from "../Standard/Collections";
import { FrameworkEvent, NativeEvent } from "../Standard/Events";
import { FrameworkProperty } from "./user-interface";
import { Enumeration } from "../Standard/Enumeration";
declare class VisualTreeManager {
    constructor(target: Widget);
    attachAll(): void;
    detachAll(): void;
    readonly target: Widget;
    readonly elements: Collection<HTMLElement>;
}
export declare abstract class Widget extends HTMLElement {
    constructor();
    private __visualTreeManager;
    private __dragDropHandler;
    protected abstract __fillVisualTree(manager: VisualTreeManager): any;
    protected connectedCallback(): void;
    protected disconnectedCallback(): void;
    private __dragDropHandler__onRequestDragStart;
    private __dragDropHandler__onDragStart;
    private __dragDropHandler__onDragMove;
    private __dragDropHandler__onDragEnd;
    private __dragDropHandler__onDragCancel;
    private __dragDropHandler__onDragEnter;
    private __dragDropHandler__onDragOver;
    private __dragDropHandler__onDragLeave;
    private __dragDropHandler__onDragDrop;
    private __onDragMove;
    DragStartEvent: FrameworkEvent;
    private __onDragStart;
    DragMoveEvent: FrameworkEvent;
    private __onDragEnd;
    DragEndEvent: FrameworkEvent;
    private __onDragCancel;
    DragCancelEvent: FrameworkEvent;
    private __onDragEnter;
    DragEnterEvent: FrameworkEvent;
    private __onDragOver;
    DragOverEvent: FrameworkEvent;
    private __onDragLeave;
    DragLeaveEvent: FrameworkEvent;
    private __onDragDrop;
    DragDropEvent: FrameworkEvent;
    private __onMouseEnter;
    MouseEnterEvent: NativeEvent;
    private __onMouseLeave;
    MouseLeaveEvent: NativeEvent;
    private __onMouseDown;
    MouseDownEvent: NativeEvent;
    private __onMouseMove;
    MouseMoveEvent: NativeEvent;
    private __onMouseUp;
    MouseUpEvent: NativeEvent;
    private __onClick;
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
    protected __fillVisualTree(): void;
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
    protected __fillVisualTree(manager: VisualTreeManager): void;
    static isDefaultProperty: FrameworkProperty;
    isDefault: any;
    static valueProperty: FrameworkProperty;
    value: any;
    static contentProperty: FrameworkProperty;
    content: any;
    static iconProperty: FrameworkProperty;
    icon: any;
}
export declare class DialogManager {
    private __openDialogs;
    showModal(options: any): Promise<unknown>;
}
export declare let dialogManager: DialogManager;
export {};
