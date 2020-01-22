import { Enumeration } from "../Standard/Enumeration.js";
import { Timer } from "./Timer.js";
import { BroadcastFrameworkEvent, FrameworkEvent, FrameworkEventArgs } from "../Standard/Events/index.js";
import DragEmulator from "./DragEmulator.js";
import { Destructible } from "../Standard/index.js";
import { DOMUtils } from "./index.js";

const DEFAULT_DRAG_HANDLER_OPTIONS = {
    touchDragStartDelay: 1
};

const DragDropHandlerState = new Enumeration([
    "Ready",
    "DragStartRequested",
    "DragDragging",
    "DropDragIn",
    "DropDragOut",
    "DropRejected"
]);

interface IDragDropHandlerOptions {
    touchDragStartDelay?: number
}

/**
 * Drag Handler class
 * Makes multi-platform dragging implementation less painful.
 */
export class DragDropHandler extends Destructible {
    constructor(target: Element, options?: IDragDropHandlerOptions) {
        super();

        this.__target = target;
        this.__options = Object.assign({}, DEFAULT_DRAG_HANDLER_OPTIONS, options);

        let touchDragDelayTimer = new Timer((this.__options.touchDragStartDelay || 0) * 1000, false);
        this.__touchDragDelayTimer = touchDragDelayTimer;
        touchDragDelayTimer.TickEvent.attach(this.__touchDragDelayTimer_onTick, this);

        //ATTACH EVENT HANDLERS
        //DOM Touch Events
        target.addEventListener("touchstart", this.__target_touchstart_handler);
        target.addEventListener("touchmove", this.__target_touchmove_handler);
        target.addEventListener("touchend", this.__target_touchend_handler);
        target.addEventListener("touchcancel", this.__target_touchcancel_handler);

        //DOM Mouse Events
        target.addEventListener("mousedown", this.__target_mousedown_handler);
        window.addEventListener("mousemove", this.__window_mousemove_handler);
        window.addEventListener("mouseup", this.__window_mouseup_handler);

        //Drag/Drop Notification Events Routing
        this.__NotifyDragStartEvent.route(this.DragStartEvent);
        this.__NotifyDragMoveEvent.route(this.DragMoveEvent);
        this.__NotifyDragEndEvent.route(this.DragEndEvent);
        this.__NotifyDragCancelEvent.route(this.DragCancelEvent);
    }

    private __target_touchstart_handler = ((evt: Event) => {
        if ((<TouchEvent>evt).touches.length !== 1) return;

        this.__touchDragDelayTimer.isEnabled = true;
    }).bind(this);

    private __target_touchmove_handler = ((evt: Event) => {
        this.__touchDragDelayTimer.isEnabled = false;

        const touches = (<TouchEvent>evt).touches;
        if (touches.length !== 1) return;

        const touch = touches[0];

        const args = {
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
    }).bind(this);

    private __target_touchend_handler = ((evt: Event) => {
        this.__touchDragDelayTimer.isEnabled = false;

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
    }).bind(this);

    private __target_touchcancel_handler = ((evt: Event) => {
        this.__touchDragDelayTimer.isEnabled = false;

        switch (this.__state) {
            case DragDropHandlerState.DragStartRequested:
            case DragDropHandlerState.DragDragging:
                this.__doDragCancel();

                this.__state = DragDropHandlerState.Ready;
                break;
        }
    }).bind(this);

    private __target_mousedown_handler = ((evt: Event) => {
        switch (this.__state) {
            case DragDropHandlerState.Ready:
                this.__doRequestDragStart();

                this.__state = DragDropHandlerState.DragStartRequested;
                break;
        }

        evt.preventDefault();
    }).bind(this);

    private __window_mouseup_handler = ((evt: Event) => {
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
    }).bind(this);

    private __window_mousemove_handler = ((evt: Event) => {
        let clientX = (<MouseEvent>evt).clientX,
            clientY = (<MouseEvent>evt).clientY;

        let args = {
            clientX,
            clientY,
            pageX: (<MouseEvent>evt).pageX,
            pageY: (<MouseEvent>evt).pageY,
            screenX: (<MouseEvent>evt).screenX,
            screenY: (<MouseEvent>evt).screenY
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
    }).bind(this);

    private __touchDragDelayTimer_onTick(sender: any, args: FrameworkEventArgs) {
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

    private __doDragStart(args: {}) {
        let data = null;
        let context = null;

        this.DragStartEvent.invoke(this, {
            setData(value: string) { data = value; },
            setContext(value: string) { context = value; },
            ...args
        });

        this.__data = data;
        this.__context = context;
    }

    private __doDragMove(args: {}) {
        this.DragMoveEvent.invoke(this, args);
    }

    private __doDragEnd(args: {}) {
        this.DragEndEvent.invoke(this, args);
    }

    private __doDragCancel() {
        this.DragCancelEvent.invoke(this, {});
    }

    private __doDragEnter(args: { _sourceHandler: DragDropHandler }) {
        let context = args._sourceHandler.__context;
        let acceptsDrop = false;

        this.DragEnterEvent.invoke(this, {
            getContext() { return context; },
            acceptDrop() { acceptsDrop = true; },
            ...args
        });

        context = null;

        this.__acceptsDrop = acceptsDrop;
    }

    private __doDragOver(args: {}) {
        this.DragOverEvent.invoke(this, {
            ...args
        });
    }

    private __doDragLeave(args: {}) {
        this.DragLeaveEvent.invoke(this, {
            ...args
        });
    }

    private __doDragDrop(args: { _sourceHandler: DragDropHandler }) {
        let data = args._sourceHandler.__data;

        this.DragDropEvent.invoke(this, {
            getData() { return data; },
            ...args
        });

        data = null;
    }

    private __onNotifyDragMove(sender: any, args: { clientX: number, clientY: number }) {
        if (sender === this) return;

        const visibleRect = DOMUtils.getElementVisibleRect(this.target);
        if (!visibleRect)
            return;

        const cursorIsOverVisibleRect = DOMUtils.pointInRect(visibleRect, new DOMPoint(args.clientX, args.clientY));

        switch (this.__state) {
            case DragDropHandlerState.Ready:
            case DragDropHandlerState.DropDragOut:
                if (cursorIsOverVisibleRect) {
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

                if (!cursorIsOverVisibleRect) {
                    this.__doDragLeave({
                        _sourceHandler: sender,
                        ...args
                    });

                    this.__state = DragDropHandlerState.DropDragOut;
                }
                break;
        }
    }

    private __onNotifyDragEnd(sender: any, args: {}) {
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

    private __data = null;
    private __context = null;
    private __acceptsDrag: boolean = false;
    private __acceptsDrop: boolean = false;

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

    private __emulator = new DragEmulator(this);

    get target(): Element { return this.__target; }
    private __target: Element;

    get options(): IDragDropHandlerOptions { return this.__options; }
    private __options: IDragDropHandlerOptions;

    protected destructor(): void {
        //DETACH EVENT HANDLERS
        //DOM Touch Events
        this.__target.addEventListener("touchstart", this.__target_touchstart_handler);
        this.__target.addEventListener("touchmove", this.__target_touchmove_handler);
        this.__target.addEventListener("touchend", this.__target_touchend_handler);
        this.__target.addEventListener("touchcancel", this.__target_touchcancel_handler);

        //DOM Mouse Events
        this.__target.addEventListener("mousedown", this.__target_mousedown_handler);
        window.addEventListener("mousemove", this.__window_mousemove_handler);
        window.addEventListener("mouseup", this.__window_mouseup_handler);

        //Drag/Drop Notification Events Routing
        this.__NotifyDragStartEvent.destruct();
        this.__NotifyDragMoveEvent.destruct();
        this.__NotifyDragEndEvent.destruct();
        this.__NotifyDragCancelEvent.destruct();
    }
}