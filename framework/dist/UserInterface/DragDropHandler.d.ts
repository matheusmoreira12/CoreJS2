import { FrameworkEvent, FrameworkEventArgs } from "../Standard/Events/index.js";
import { Destructible } from "../Standard/index.js";
interface IDragDropHandlerOptions {
    touchDragStartDelay?: number;
}
/**
 * Drag Handler class
 * Makes multi-platform dragging implementation less painful.
 */
export declare class DragDropHandler extends Destructible {
    constructor(target: Element, options?: IDragDropHandlerOptions);
    private __target_touchstart_handler;
    private __target_touchmove_handler;
    private __target_touchend_handler;
    private __target_touchcancel_handler;
    private __target_mousedown_handler;
    private __window_mouseup_handler;
    private __window_mousemove_handler;
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
    private __data;
    private __context;
    private __acceptsDrag;
    private __acceptsDrop;
    private __state;
    private __touchDragDelayTimer;
    get RequestDragStartEvent(): FrameworkEvent<FrameworkEventArgs>;
    private __RequestDragStartEvent;
    get DragStartEvent(): FrameworkEvent<FrameworkEventArgs>;
    private __DragStartEvent;
    get DragMoveEvent(): FrameworkEvent<FrameworkEventArgs>;
    private __DragMoveEvent;
    get DragEndEvent(): FrameworkEvent<FrameworkEventArgs>;
    private __DragEndEvent;
    get DragCancelEvent(): FrameworkEvent<FrameworkEventArgs>;
    private __DragCancelEvent;
    get DragEnterEvent(): FrameworkEvent<FrameworkEventArgs>;
    private __DragEnterEvent;
    get DragOverEvent(): FrameworkEvent<FrameworkEventArgs>;
    private __DragOverEvent;
    get DragLeaveEvent(): FrameworkEvent<FrameworkEventArgs>;
    private __DragLeaveEvent;
    get DragDropEvent(): FrameworkEvent<FrameworkEventArgs>;
    private __DragDropEvent;
    private __emulator;
    get target(): Element;
    private __target;
    get options(): IDragDropHandlerOptions;
    private __options;
    protected destructor(): void;
}
export {};
