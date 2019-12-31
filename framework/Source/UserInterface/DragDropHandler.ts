import { Enumeration } from "../Standard/Enumeration.js";
import { Timer, Utils } from "./user-interface.js";
import { BroadcastFrameworkEvent, FrameworkEvent } from "../Standard/Events.js";
import DragEmulator from "./DragEmulator.js";

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
export class DragDropHandler {
    constructor(target) {
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

    private __onTouchStart(evt) {
        if (evt.touches.length !== 1) return;

        this.__touchDragDelayTimer.start();
    }

    private __onTouchMove(evt) {
        this.__touchDragDelayTimer.stop();

        if (evt.touches.length !== 1) return;

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

    private __onTouchEnd(evt) {
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

    private __onTouchCancel(evt) {
        this.__touchDragDelayTimer.stop();

        switch (this.__state) {
            case DragDropHandlerState.DragStartRequested:
            case DragDropHandlerState.DragDragging:
                this.__doDragCancel();

                this.__state = DragDropHandlerState.Ready;
                break;
        }
    }

    private __target_onMouseDown(evt) {
        switch (this.__state) {
            case DragDropHandlerState.Ready:
                this.__doRequestDragStart();

                this.__state = DragDropHandlerState.DragStartRequested;
                break;
        }

        evt.preventDefault();
    }

    private __window_onMouseUp(evt) {
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

    private __window_onMouseMove(evt) {
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

    private __touchDragDelayTimer_onTick(sender, args) {
        switch (this.__state) {
            case DragDropHandlerState.Ready:
                this.__doRequestDragStart();

                this.__state = DragDropHandlerState.DragStartRequested;
                break;
        }
    }

    private __doRequestDragStart() {
        let acceptsDrag = false;

        this.RequestDragStartEvent.invoke(this, {
            acceptDrag() { acceptsDrag = true; }
        });

        this.__acceptsDrag = acceptsDrag;
    }

    private __doDragStart(args) {
        let data = null;
        let context = null;

        this.DragStartEvent.invoke(this, {
            setData(value) { data = value; },
            setContext(value) { context = value; },
            ...args
        });

        this.__data = data;
        this.__context = context;
    }

    private __doDragMove(args) {
        this.DragMoveEvent.invoke(this, args);
    }

    private __doDragEnd(args) {
        this.DragEndEvent.invoke(this, args);
    }

    private __doDragCancel() {
        this.DragCancelEvent.invoke(this, {});
    }

    private __doDragEnter(args) {
        let { _sourceHandler: sourceHandler } = args;

        let context = sourceHandler._context;
        let acceptsDrop = false;

        this.DragEnterEvent.invoke(this, {
            getContext() { return context; },
            acceptDrop() { acceptsDrop = true; },
            ...args
        });

        context = null;

        this.__acceptsDrop = acceptsDrop;
    }

    private __doDragOver(args) {
        this.DragOverEvent.invoke(this, {
            ...args
        });
    }

    private __doDragLeave(args) {
        this.DragLeaveEvent.invoke(this, {
            ...args
        });
    }

    private __doDragDrop(args) {
        let { _sourceHandler: sourceHandler } = args;

        let data = sourceHandler._data;

        this.DragDropEvent.invoke(this, {
            getData() { return data; },
            ...args
        });

        data = null;
    }

    private __onNotifyDragMove(sender, args) {
        if (sender === this) return;

        let { clientX, clientY } = args;

        let visibleRect = Utils.getElementVisibleRect(this.target);

        let cursorIsOver = Utils.pointInRect(visibleRect, new DOMPoint(clientX, clientY));

        switch (this.__state) {
            case DragDropHandlerState.Ready:
            case DragDropHandlerState.DropDragOut:
                if (cursorIsOver) {
                    this.__doDragEnter({
                        _sourceHandler: sender,
                        ...args
                    });

                    if (this.__acceptsDrop)
                        this.__state = DragDropHandlerState.DropDragIn;
                    else
                        this.__state = DragDropHandlerState.DropRejected;
                }
                break;

            case DragDropHandlerState.DropDragIn:
                this.__doDragOver({
                    _sourceHandler: sender,
                    ...args
                });

                if (!cursorIsOver) {
                    this.__doDragLeave({
                        _sourceHandler: sender,
                        ...args
                    });

                    this.__state = DragDropHandlerState.DropDragOut;
                }
                break;
        }
    }

    private __onNotifyDragEnd(sender, args) {
        if (sender === this) return;

        let _args = {
            _sourceHandler: sender,
            ...args
        };

        switch (this.__state) {
            case DragDropHandlerState.DropDragIn:

                this.__doDragDrop(_args);
                break;

            case DragDropHandlerState.DropRejected:
                this.__state = DragDropHandlerState.Ready;

                break;
        }
    }

    private __NotifyDragStartEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragStart");
    private __NotifyDragMoveEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragMove", this.__onNotifyDragMove.bind(this));
    private __NotifyDragEndEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragEnd", this.__onNotifyDragEnd.bind(this));
    private __NotifyDragCancelEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragCancel");

    private __emulator = new DragEmulator(this);

    private __data = null;
    private __context = null;
    private __acceptsDrag: boolean;
    private __acceptsDrop: boolean;

    private __state = DragDropHandlerState.Ready;

    private __touchDragDelayTimer: Timer;

    get RequestDragStartEvent() { return this.__RequestDragStartEvent; }
    private __RequestDragStartEvent = new FrameworkEvent();

    get DragStartEvent() { return this.__DragStartEvent; }
    private __DragStartEvent = new FrameworkEvent();

    get DragMoveEvent() { return this.__DragMoveEvent; }
    private __DragMoveEvent = new FrameworkEvent();

    get DragEndEvent() { return this.__DragEndEvent; }
    private __DragEndEvent = new FrameworkEvent();

    get DragCancelEvent() { return this.__DragCancelEvent; }
    private __DragCancelEvent = new FrameworkEvent();

    get DragEnterEvent() { return this.__DragEnterEvent; }
    private __DragEnterEvent = new FrameworkEvent();

    get DragOverEvent() { return this.__DragOverEvent; }
    private __DragOverEvent = new FrameworkEvent();

    get DragLeaveEvent() { return this.__DragLeaveEvent; }
    private __DragLeaveEvent = new FrameworkEvent();

    get DragDropEvent() { return this.__DragDropEvent; }
    private __DragDropEvent = new FrameworkEvent();

    get target() { return this.__target; }
    private __target: Element;
}