/**
 * Drag Handler class
 * Makes multi-platform dragging implementation less painful.
 */
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
export class DragDropHandler {
    constructor(target) {
        this._NotifyDragStartEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragStart");
        this._NotifyDragMoveEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragMove", this._onNotifyDragMove.bind(this));
        this._NotifyDragEndEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragEnd", this._onNotifyDragEnd.bind(this));
        this._NotifyDragCancelEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragCancel");
        this._RequestDragStartEvent = new FrameworkEvent();
        this._DragStartEvent = new FrameworkEvent();
        this._DragMoveEvent = new FrameworkEvent();
        this._DragEndEvent = new FrameworkEvent();
        this._DragCancelEvent = new FrameworkEvent();
        this._DragEnterEvent = new FrameworkEvent();
        this._DragOverEvent = new FrameworkEvent();
        this._DragLeaveEvent = new FrameworkEvent();
        this._DragDropEvent = new FrameworkEvent();
        this._emulator = new DragEmulator(this);
        this._data = null;
        this._context = null;
        this._state = DragDropHandlerState.Ready;
        this._target = target;
        let touchDragDelayTimer = new Timer(1000, false);
        touchDragDelayTimer.TickEvent.attach(this._touchDragDelayTimer_onTick, this);
        this._touchDragDelayTimer = touchDragDelayTimer;
        ///        target.addEventListener("touchstart", this._onTouchStart.bind(this));
        ///        target.addEventListener("touchmove", this._onTouchMove.bind(this));
        ///        target.addEventListener("touchend", this._onTouchEnd.bind(this));
        ///        target.addEventListener("touchcancel", this._onTouchCancel.bind(this));
        target.addEventListener("mousedown", this._target_onMouseDown.bind(this));
        window.addEventListener("mousemove", this._window_onMouseMove.bind(this));
        window.addEventListener("mouseup", this._window_onMouseUp.bind(this));
        this._NotifyDragStartEvent.route(this.DragStartEvent);
        this._NotifyDragMoveEvent.route(this.DragMoveEvent);
        this._NotifyDragEndEvent.route(this.DragEndEvent);
        this._NotifyDragCancelEvent.route(this.DragCancelEvent);
    }
    ///TODO: Implement drag and drop logic
    _onTouchStart(evt) {
        if (evt.touches.length !== 1)
            return;
        this._touchDragDelayTimer.start();
    }
    _onTouchMove(evt) {
        this._touchDragDelayTimer.stop();
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
        switch (this._state) {
            case DragDropHandlerState.DragStartRequested:
                this._doDragStart(args);
                this._state = DragDropHandlerState.DragDragging;
                break;
            case DragDropHandlerState.DragDragging:
                this._doDragMove(args);
                break;
        }
    }
    _onTouchEnd(evt) {
        this._touchDragDelayTimer.stop();
        switch (this._state) {
            case DragDropHandlerState.DragStartRequested:
                this._doDragCancel();
                this._state = DragDropHandlerState.Ready;
                break;
            case DragDropHandlerState.DragDragging:
                this._doDragEnd();
                this._state = DragDropHandlerState.Ready;
                break;
        }
    }
    _onTouchCancel(evt) {
        this._touchDragDelayTimer.stop();
        switch (this._state) {
            case DragDropHandlerState.DragStartRequested:
            case DragDropHandlerState.DragDragging:
                this._doDragCancel();
                this._state = DragDropHandlerState.Ready;
                break;
        }
    }
    _target_onMouseDown(evt) {
        switch (this._state) {
            case DragDropHandlerState.Ready:
                this._doRequestDragStart();
                this._state = DragDropHandlerState.DragStartRequested;
                break;
        }
        evt.preventDefault();
    }
    _window_onMouseUp(evt) {
        switch (this._state) {
            case DragDropHandlerState.DragStartRequested:
                this._doDragCancel();
                this._state = DragDropHandlerState.Ready;
                break;
            case DragDropHandlerState.DragDragging:
                this._doDragEnd();
                this._state = DragDropHandlerState.Ready;
                break;
        }
    }
    _window_onMouseMove(evt) {
        let { clientX, clientY } = evt;
        let args = {
            clientX,
            clientY,
            pageX: evt.pageX,
            pageY: evt.pageY,
            screenX: evt.screenX,
            screenY: evt.screenY
        };
        switch (this._state) {
            case DragDropHandlerState.DragStartRequested:
                if (this._acceptsDrag) {
                    this._doDragStart(args);
                    this._state = DragDropHandlerState.DragDragging;
                }
                else
                    this._state = DragDropHandlerState.Ready;
                break;
            case DragDropHandlerState.DragDragging:
                this._doDragMove(args);
                break;
        }
    }
    _touchDragDelayTimer_onTick(sender, args) {
        switch (this._state) {
            case DragDropHandlerState.Ready:
                this._doRequestDragStart();
                this._state = DragDropHandlerState.DragStartRequested;
                break;
        }
    }
    _doRequestDragStart() {
        let acceptsDrag = false;
        this.RequestDragStartEvent.invoke(this, {
            acceptDrag() { acceptsDrag = true; }
        });
        this._acceptsDrag = !!acceptsDrag;
    }
    _doDragStart(args) {
        let data = null;
        let context = null;
        this.DragStartEvent.invoke(this, Object.assign({ setData(value) { data = value; },
            setContext(value) { context = value; } }, args));
        this._data = data;
        this._context = context;
    }
    _doDragMove(args) {
        this.DragMoveEvent.invoke(this, args);
    }
    _doDragEnd(args) {
        this.DragEndEvent.invoke(this, args);
    }
    _doDragCancel() {
        this.DragCancelEvent.invoke(this);
    }
    _doDragEnter(args) {
        let { _sourceHandler: sourceHandler } = args;
        let context = sourceHandler._context;
        let acceptsDrop = false;
        this.DragEnterEvent.invoke(this, Object.assign({ getContext() { return context; },
            acceptDrop() { acceptsDrop = true; } }, args));
        context = null;
        this._acceptsDrop = acceptsDrop;
    }
    _doDragOver(args) {
        this.DragOverEvent.invoke(this, Object.assign({}, args));
    }
    _doDragLeave(args) {
        this.DragLeaveEvent.invoke(this, Object.assign({}, args));
    }
    _doDragDrop(args) {
        let { _sourceHandler: sourceHandler } = args;
        let data = sourceHandler._data;
        this.DragDropEvent.invoke(this, Object.assign({ getData() { return data; } }, args));
        data = null;
    }
    _onNotifyDragMove(sender, args) {
        if (sender === this)
            return;
        let { clientX, clientY } = args;
        let visibleRect = Utils.getElementVisibleRect(this.target);
        let cursorIsOver = Utils.pointInRect(visibleRect, new DOMPoint(clientX, clientY));
        switch (this._state) {
            case DragDropHandlerState.Ready:
            case DragDropHandlerState.DropDragOut:
                if (cursorIsOver) {
                    this._doDragEnter(Object.assign({ _sourceHandler: sender }, args));
                    if (this._acceptsDrop)
                        this._state = DragDropHandlerState.DropDragIn;
                    else
                        this._state = DragDropHandlerState.DropRejected;
                }
                break;
            case DragDropHandlerState.DropDragIn:
                this._doDragOver(Object.assign({ _sourceHandler: sender }, args));
                if (!cursorIsOver) {
                    this._doDragLeave(Object.assign({ _sourceHandler: sender }, args));
                    this._state = DragDropHandlerState.DropDragOut;
                }
                break;
        }
    }
    _onNotifyDragEnd(sender, args) {
        if (sender === this)
            return;
        let _args = Object.assign({ _sourceHandler: sender }, args);
        switch (this._state) {
            case DragDropHandlerState.DropDragIn:
                this._doDragDrop(_args);
                break;
            case DragDropHandlerState.DropRejected:
                this._state = DragDropHandlerState.Ready;
                break;
        }
    }
    get RequestDragStartEvent() { return this._RequestDragStartEvent; }
    get DragStartEvent() { return this._DragStartEvent; }
    get DragMoveEvent() { return this._DragMoveEvent; }
    get DragEndEvent() { return this._DragEndEvent; }
    get DragCancelEvent() { return this._DragCancelEvent; }
    get DragEnterEvent() { return this._DragEnterEvent; }
    get DragOverEvent() { return this._DragOverEvent; }
    get DragLeaveEvent() { return this._DragLeaveEvent; }
    get DragDropEvent() { return this._DragDropEvent; }
    get target() { return this._target; }
}
