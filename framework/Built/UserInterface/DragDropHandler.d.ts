import { FrameworkEvent } from "../Standard/Events";
/**
 * Drag Handler class
 * Makes multi-platform dragging implementation less painful.
 */
export default class DragDropHandler {
    constructor(target: any);
    private __onTouchStart;
    private __onTouchMove;
    private __onTouchEnd;
    private __onTouchCancel;
    private __target_onMouseDown;
    private __window_onMouseUp;
    private __window_onMouseMove;
    private __touchDragDelayTimer_onTick;
    private __doRequestDragStart;
    private __doDragStart;
    private __doDragMove;
    private __doDragEnd;
    private __doDragCancel;
    private __doDragEnter;
    private __doDragOver;
    private __doDragLeave;
    private __doDragDrop;
    private __onNotifyDragMove;
    private __onNotifyDragEnd;
    private __NotifyDragStartEvent;
    private __NotifyDragMoveEvent;
    private __NotifyDragEndEvent;
    private __NotifyDragCancelEvent;
    private __emulator;
    private __data;
    private __context;
    private __acceptsDrag;
    private __acceptsDrop;
    private __state;
    private __touchDragDelayTimer;
    readonly RequestDragStartEvent: FrameworkEvent;
    private __RequestDragStartEvent;
    readonly DragStartEvent: FrameworkEvent;
    private __DragStartEvent;
    readonly DragMoveEvent: FrameworkEvent;
    private __DragMoveEvent;
    readonly DragEndEvent: FrameworkEvent;
    private __DragEndEvent;
    readonly DragCancelEvent: FrameworkEvent;
    private __DragCancelEvent;
    readonly DragEnterEvent: FrameworkEvent;
    private __DragEnterEvent;
    readonly DragOverEvent: FrameworkEvent;
    private __DragOverEvent;
    readonly DragLeaveEvent: FrameworkEvent;
    private __DragLeaveEvent;
    readonly DragDropEvent: FrameworkEvent;
    private __DragDropEvent;
    readonly target: Element;
    private __target;
}
