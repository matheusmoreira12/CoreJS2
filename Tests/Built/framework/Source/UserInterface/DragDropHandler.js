import { Enumeration } from "../Standard/Enumeration";
import { Timer, Utils } from "./user-interface";
import { BroadcastFrameworkEvent, FrameworkEvent } from "../Standard/Events";
import DragEmulator from "./DragEmulator";
const DEFAULT_DRAG_HANDLER_OPTIONS = {
    touchDragStartDelay: 1000
};
const DragDropHandlerState = new Enumeration([
    "Ready",
    "DragStartRequested",
    "DragDragging",
    "DropDragIn",
    "DropDragOut",
    "DropRejected"
]);
/**
 * Drag Handler class
 * Makes multi-platform dragging implementation less painful.
 */
export default class DragDropHandler {
    constructor(target) {
        this.__NotifyDragStartEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragStart");
        this.__NotifyDragMoveEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragMove", this.__onNotifyDragMove.bind(this));
        this.__NotifyDragEndEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragEnd", this.__onNotifyDragEnd.bind(this));
        this.__NotifyDragCancelEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragCancel");
        this.__emulator = new DragEmulator(this);
        this.__data = null;
        this.__context = null;
        this.__state = DragDropHandlerState.Ready;
        this.__RequestDragStartEvent = new FrameworkEvent();
        this.__DragStartEvent = new FrameworkEvent();
        this.__DragMoveEvent = new FrameworkEvent();
        this.__DragEndEvent = new FrameworkEvent();
        this.__DragCancelEvent = new FrameworkEvent();
        this.__DragEnterEvent = new FrameworkEvent();
        this.__DragOverEvent = new FrameworkEvent();
        this.__DragLeaveEvent = new FrameworkEvent();
        this.__DragDropEvent = new FrameworkEvent();
        this.__target = target;
        let touchDragDelayTimer = new Timer(1000, false);
        this.__touchDragDelayTimer = touchDragDelayTimer;
        touchDragDelayTimer.TickEvent.attach(this.__touchDragDelayTimer_onTick, this);
        ///TODO: Re-implement touch drag interaction
        ///        target.addEventListener("touchstart", this._onTouchStart.bind(this));
        ///        target.addEventListener("touchmove", this._onTouchMove.bind(this));
        ///        target.addEventListener("touchend", this._onTouchEnd.bind(this));
        ///        target.addEventListener("touchcancel", this._onTouchCancel.bind(this));
        target.addEventListener("mousedown", this.__target_onMouseDown.bind(this));
        window.addEventListener("mousemove", this.__window_onMouseMove.bind(this));
        window.addEventListener("mouseup", this.__window_onMouseUp.bind(this));
        this.__NotifyDragStartEvent.route(this.DragStartEvent);
        this.__NotifyDragMoveEvent.route(this.DragMoveEvent);
        this.__NotifyDragEndEvent.route(this.DragEndEvent);
        this.__NotifyDragCancelEvent.route(this.DragCancelEvent);
    }
    ///TODO: Implement drag and drop logic
    __onTouchStart(evt) {
        if (evt.touches.length !== 1)
            return;
        this.__touchDragDelayTimer.start();
    }
    __onTouchMove(evt) {
        this.__touchDragDelayTimer.stop();
        if (evt.touches.length !== 1)
            return;
        let touch = evt.touches[0];
        let args = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            pageX: touch.pageX,
            pageY: touch.pageY,
            screenX: touch.screenX,
            screenY: touch.screenY
        };
        switch (this.__state) {
            case DragDropHandlerState.DragStartRequested:
                this.__doDragStart(args);
                this.__state = DragDropHandlerState.DragDragging;
                break;
            case DragDropHandlerState.DragDragging:
                this.__doDragMove(args);
                break;
        }
    }
    __onTouchEnd(evt) {
        this.__touchDragDelayTimer.stop();
        switch (this.__state) {
            case DragDropHandlerState.DragStartRequested:
                this.__doDragCancel();
                this.__state = DragDropHandlerState.Ready;
                break;
            case DragDropHandlerState.DragDragging:
                this.__doDragEnd(evt);
                this.__state = DragDropHandlerState.Ready;
                break;
        }
    }
    __onTouchCancel(evt) {
        this.__touchDragDelayTimer.stop();
        switch (this.__state) {
            case DragDropHandlerState.DragStartRequested:
            case DragDropHandlerState.DragDragging:
                this.__doDragCancel();
                this.__state = DragDropHandlerState.Ready;
                break;
        }
    }
    __target_onMouseDown(evt) {
        switch (this.__state) {
            case DragDropHandlerState.Ready:
                this.__doRequestDragStart();
                this.__state = DragDropHandlerState.DragStartRequested;
                break;
        }
        evt.preventDefault();
    }
    __window_onMouseUp(evt) {
        switch (this.__state) {
            case DragDropHandlerState.DragStartRequested:
                this.__doDragCancel();
                this.__state = DragDropHandlerState.Ready;
                break;
            case DragDropHandlerState.DragDragging:
                this.__doDragEnd(evt);
                this.__state = DragDropHandlerState.Ready;
                break;
        }
    }
    __window_onMouseMove(evt) {
        let { clientX, clientY } = evt;
        let args = {
            clientX,
            clientY,
            pageX: evt.pageX,
            pageY: evt.pageY,
            screenX: evt.screenX,
            screenY: evt.screenY
        };
        switch (this.__state) {
            case DragDropHandlerState.DragStartRequested:
                if (this.__acceptsDrag) {
                    this.__doDragStart(args);
                    this.__state = DragDropHandlerState.DragDragging;
                }
                else
                    this.__state = DragDropHandlerState.Ready;
                break;
            case DragDropHandlerState.DragDragging:
                this.__doDragMove(args);
                break;
        }
    }
    __touchDragDelayTimer_onTick(sender, args) {
        switch (this.__state) {
            case DragDropHandlerState.Ready:
                this.__doRequestDragStart();
                this.__state = DragDropHandlerState.DragStartRequested;
                break;
        }
    }
    __doRequestDragStart() {
        let acceptsDrag = false;
        this.RequestDragStartEvent.invoke(this, {
            acceptDrag() { acceptsDrag = true; }
        });
        this.__acceptsDrag = acceptsDrag;
    }
    __doDragStart(args) {
        let data = null;
        let context = null;
        this.DragStartEvent.invoke(this, Object.assign({ setData(value) { data = value; },
            setContext(value) { context = value; } }, args));
        this.__data = data;
        this.__context = context;
    }
    __doDragMove(args) {
        this.DragMoveEvent.invoke(this, args);
    }
    __doDragEnd(args) {
        this.DragEndEvent.invoke(this, args);
    }
    __doDragCancel() {
        this.DragCancelEvent.invoke(this, {});
    }
    __doDragEnter(args) {
        let { _sourceHandler: sourceHandler } = args;
        let context = sourceHandler._context;
        let acceptsDrop = false;
        this.DragEnterEvent.invoke(this, Object.assign({ getContext() { return context; },
            acceptDrop() { acceptsDrop = true; } }, args));
        context = null;
        this.__acceptsDrop = acceptsDrop;
    }
    __doDragOver(args) {
        this.DragOverEvent.invoke(this, Object.assign({}, args));
    }
    __doDragLeave(args) {
        this.DragLeaveEvent.invoke(this, Object.assign({}, args));
    }
    __doDragDrop(args) {
        let { _sourceHandler: sourceHandler } = args;
        let data = sourceHandler._data;
        this.DragDropEvent.invoke(this, Object.assign({ getData() { return data; } }, args));
        data = null;
    }
    __onNotifyDragMove(sender, args) {
        if (sender === this)
            return;
        let { clientX, clientY } = args;
        let visibleRect = Utils.getElementVisibleRect(this.target);
        let cursorIsOver = Utils.pointInRect(visibleRect, new DOMPoint(clientX, clientY));
        switch (this.__state) {
            case DragDropHandlerState.Ready:
            case DragDropHandlerState.DropDragOut:
                if (cursorIsOver) {
                    this.__doDragEnter(Object.assign({ _sourceHandler: sender }, args));
                    if (this.__acceptsDrop)
                        this.__state = DragDropHandlerState.DropDragIn;
                    else
                        this.__state = DragDropHandlerState.DropRejected;
                }
                break;
            case DragDropHandlerState.DropDragIn:
                this.__doDragOver(Object.assign({ _sourceHandler: sender }, args));
                if (!cursorIsOver) {
                    this.__doDragLeave(Object.assign({ _sourceHandler: sender }, args));
                    this.__state = DragDropHandlerState.DropDragOut;
                }
                break;
        }
    }
    __onNotifyDragEnd(sender, args) {
        if (sender === this)
            return;
        let _args = Object.assign({ _sourceHandler: sender }, args);
        switch (this.__state) {
            case DragDropHandlerState.DropDragIn:
                this.__doDragDrop(_args);
                break;
            case DragDropHandlerState.DropRejected:
                this.__state = DragDropHandlerState.Ready;
                break;
        }
    }
    get RequestDragStartEvent() { return this.__RequestDragStartEvent; }
    get DragStartEvent() { return this.__DragStartEvent; }
    get DragMoveEvent() { return this.__DragMoveEvent; }
    get DragEndEvent() { return this.__DragEndEvent; }
    get DragCancelEvent() { return this.__DragCancelEvent; }
    get DragEnterEvent() { return this.__DragEnterEvent; }
    get DragOverEvent() { return this.__DragOverEvent; }
    get DragLeaveEvent() { return this.__DragLeaveEvent; }
    get DragDropEvent() { return this.__DragDropEvent; }
    get target() { return this.__target; }
}
