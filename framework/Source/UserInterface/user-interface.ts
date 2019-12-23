import { ContextSelectionFlags } from "../Standard/ContextSelectionFlags";
import { Enumeration } from "../Standard/Enumeration";
import { ValueConverter } from "../Standard/Standard";
import { InterfaceMember, Interface, InterfaceMemberType } from "../Standard/Interfaces/Interface";
import { FrameworkEvent, BroadcastFrameworkEvent } from "../Standard/Events";
import { InvalidOperationException, ArgumentTypeException, ArgumentNullException } from "../Standard/Exceptions";
import { Collection, Dictionary } from "../Standard/Collections";

export class BooleanAttributeValueConverter implements ValueConverter {
    convertBack(value): boolean {
        if (value === null) return null;

        if (value === "false") return false;

        return true;
    }

    convert(value): string {
        if (value === null) return null;

        if (value === false) return "false";

        return "";
    }
}

export class JSONAttributeValueConverter implements ValueConverter {
    convertBack(value): JSON {
        return JSON.parse(value);
    }

    convert(value): string {
        return JSON.stringify(value);
    }
}

export class FlagsAttributeValueConverter implements ValueConverter {
    convertBack(value: string): ContextSelectionFlags {
        return ContextSelectionFlags.parse(value);
    }

    convert(value): string {
        return value.toString();
    }
}

export class EnumerationAttributeValueConverter<T> implements ValueConverter {
    constructor(enumeration: Enumeration<T>) {
        this.__enumeration = enumeration;
    }

    convertBack(value: string): T {
        if (value === null) return null;
        return this.__enumeration.parse(value);
    }

    convert(value: T): string {
        if (value === null) return null;
        return this.__enumeration.toString(value);
    }

    private __enumeration: Enumeration<T>;
}

const DEFAULT_FRAMEWORK_PROPERTY_OPTIONS = {
    defaultValue: null
};

export const IFrameworkPropertyOptions = new Interface(
    new InterfaceMember("defaultValue", InterfaceMemberType.Property)
);

export interface FrameworkPropertyOptions {
    defaultValue: any
}

/**
 * FrameworkProperty class
 * Eases the integration between user-defined properties and framework features.
 */
export class FrameworkProperty {
    constructor(name: string, options: FrameworkPropertyOptions) {
        options = Object.assign({}, DEFAULT_FRAMEWORK_PROPERTY_OPTIONS, options);

        this.__name = name;
        this.__options = options;
    }

    get(target) {
        const options = this.__options;
        const storedValues = this.__storedValues;
        if (!storedValues.has(target))
            return options.defaultValue;

        return storedValues.get(target);
    }

    set(target, value) {
        const oldValue = this.get(target);

        const storedValues = this.__storedValues;
        storedValues.set(target, value);

        if (value !== oldValue)
            this.ChangeEvent.invoke(this, {
                target: target,
                property: this,
                oldValue: oldValue,
                newValue: value
            });
    }

    ChangeEvent = new FrameworkEvent();

    get name(): string { return this.__name; }
    private __name: string;

    get options(): FrameworkPropertyOptions { return this.__options; }
    private __options: FrameworkPropertyOptions;

    private __storedValues = new WeakMap();
}

/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export abstract class FrameworkAction {
    constructor() {
        if (this.constructor === FrameworkAction) throw new InvalidOperationException("Invalid constructor");

        this.__ExecutedEvent = new FrameworkEvent();
    }

    execute(data?: Dictionary<string, any>): void {
        this.__ExecutedEvent.invoke(this, {
            data: data
        });
    }

    get ExecutedEvent() { return this.__ExecutedEvent; }
    private __ExecutedEvent: FrameworkEvent;
}

/**
 * Trigger base class
 */
export abstract class Trigger {
    constructor() {
        if (new.target === Trigger)
            throw new InvalidOperationException("Invalid constructor");
    }
}

/**
 * 
 */
export class Setter {

}

/**
 * PropertyTrigger class
 * Triggers a group of action when the specified property matches the specified value.
 */

export class PropertyTrigger extends Trigger {
    constructor(target: object, targetProperty: FrameworkProperty, value: any, ...actions: FrameworkAction[]) {
        super();

        if (typeof target !== "object") throw new ArgumentTypeException("target", target, Object);

        if (!(targetProperty instanceof FrameworkProperty)) throw new ArgumentTypeException("targetProperty",
            targetProperty, FrameworkProperty);

        this.__target = target;
        this.__targetProperty = targetProperty;
        this.__value = value;

        targetProperty.ChangeEvent.attach(this.__targetProperty_onChange, this);
    }

    private __targetProperty_onChange(sender, args) {
        if (args.target !== this.target)
            return;
        if (args.newValue !== this.value)
            return;
    }

    get target(): object { return this.__target; }
    private __target: object;

    get targetProperty(): FrameworkProperty { return this.__targetProperty; }
    private __targetProperty: FrameworkProperty;

    get value(): any { return this.__value; }
    private __value: any;

    get setters(): Collection<Setter> { return this.__setters; }
    private __setters: Collection<Setter>;
}

/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export class EventTrigger extends Trigger {
    constructor(targetEvent: FrameworkEvent, ...actions: FrameworkAction[]) {
        super(...actions);

        if (!(targetEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("targetEvent", targetEvent, FrameworkEvent);

        this.__targetEvent = targetEvent;
        this.__actions = new Collection(...actions);

        targetEvent.attach(this.__targetEvent_handler, this);
    }

    private __targetEvent_handler() {
        this.__executeActions();
    }

    protected __executeActions(data?: Dictionary<string, any>) {
        const executionErrors = [];

        for (let action of this.actions) {
            try {
                action.execute(data);
            }
            catch (e) {
                executionErrors.push(e);
            }
        }

        for (let e of executionErrors)
            throw e;
    }

    get targetEvent(): FrameworkEvent { return this.__targetEvent; }
    private __targetEvent: FrameworkEvent;

    get actions(): Collection<FrameworkAction> { return this.__actions; }
    private __actions: Collection<FrameworkAction>;
}

/** 
 * Visual State Manager
 *  Manages the interactions between user interface and logic. 
 */
class VisualStateManager {
    constructor() {
    }

    serverTaskStartedEvent = new BroadcastFrameworkEvent("ServerTask_started", this._onServerTaskStarted, this);
    serverTaskFinishedEvent = new BroadcastFrameworkEvent("ServerTask_finished", this._onServerTaskFinished, this);

    _onServerTaskStarted() {
        mainSpinner.hidden = false;
    }

    _onServerTaskFinished() {
        mainSpinner.hidden = true;
    }
}

export const visualStateManager = new VisualStateManager();

/**
 * 
 */
export const Utils = {
    selectAllText(elem) {
        var range = document.createRange();
        range.selectNodeContents(elem);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    },

    deselectAllText() {
        window.getSelection().removeAllRanges();
    },

    intersectRects(rect1, rect2) {
        let { left: left1, top: top1, right: right1, bottom: bottom1 } = rect1;
        let { left: left2, top: top2, right: right2, bottom: bottom2 } = rect2;

        let right = Math.min(right1, right2);
        let left = Math.min(Math.max(left1, left2), right);

        let bottom = Math.min(bottom1, bottom2);
        let top = Math.min(Math.max(top1, top2), bottom);

        return new DOMRect(left, top, right - left, bottom - top);
    },

    offsetRect(rect, offsetTop, offsetRight, offsetBottom, offsetLeft) {
        let { top, right, bottom, left } = rect;

        top += offsetTop;

        right += offsetRight;

        bottom += offsetBottom;

        left += offsetLeft;

        return new DOMRect(left, top, right - left, bottom - top);
    },

    clipRectSide(rect, side, amount) {
        let { top, right, bottom, left } = rect;

        switch (side) {
            case "top":
                bottom = top + amount;
                break;

            case "right":
                left = right - amount;
                break;

            case "bottom":
                top = bottom - amount;
                break;

            case "left":
                right = left + amount;
                break;
        }

        return new DOMRect(left, top, right - left, bottom - top);
    },

    pointInRect(rect, point) {
        return rect.left <= point.x &&
            rect.right >= point.x &&
            rect.top <= point.y &&
            rect.bottom >= point.y;
    },

    rectsIntersect(rect1, rect2) {
        let topLeft2 = new DOMPoint(rect2.left, rect2.top),
            topRight2 = new DOMPoint(rect2.right, rect2.top),
            bottomRight2 = new DOMPoint(rect2.right, rect2.bottom),
            bottomLeft2 = new DOMPoint(rect2.left, rect2.bottom);

        return this.pointInRect(topLeft2, rect1) ||
            this.pointInRect(topRight2, rect1) ||
            this.pointInRect(bottomRight2, rect1) ||
            this.pointInRect(bottomLeft2, rect1);
    },

    *getElementTree(elem) {
        while (elem) {
            yield elem;

            elem = elem.parentElement;
        }
    },

    elementIsScrollable(elem) {
        let compStyle = getComputedStyle(elem);

        return compStyle.overflowX === "scroll" ||
            compStyle.overflowX === "auto" ||
            compStyle.overflowY === "scroll" ||
            compStyle.overflowY === "auto";
    },

    *getViewportElements(elems) {
        for (let elem of elems)
            if (this.elementIsScrollable(elem))
                yield elem;
    },

    *getElementsUnderCursor(elems, cursorPos) {
        for (let elem of elems) {
            let boundingRect = elem.getBoundingClientRect();

            if (this.pointInRect(boundingRect, cursorPos))
                yield elem;
        }
    },

    getElementVisibleRect(elem) {
        let result = null;

        for (let _elem of this.getElementTree(elem)) {
            let boundingRect = _elem.getBoundingClientRect();

            if (!result)
                result = boundingRect;
            else
                result = this.intersectRects(result, boundingRect);

            if (result.left >= result.right || result.top >= result.bottom) break;
        }

        return result;
    }
};

/**
 * 
 */
export class Timer {
    constructor(delayMillis = 100, isPeriodic = true) {
        this.__delayMillis = delayMillis;
        this.__isPeriodic = isPeriodic;
    }

    start() {
        this.stop();

        function onTimeout() {
            this._TickEvent.invoke(this);

            if (this.isPeriodic)
                this.start();
        }

        this.__timeoutHandle = setTimeout(onTimeout.bind(this), this.delayMillis);
    }

    stop() {
        if (!this.__timeoutHandle) return;

        clearTimeout(this.__timeoutHandle);

        this.__timeoutHandle = null;
    }

    _TickEvent = new FrameworkEvent();

    get delayMillis(): number { return this.__delayMillis; }
    private __delayMillis: number;

    get isPeriodic(): boolean { return this.__isPeriodic; }
    private __isPeriodic: boolean;

    get TickEvent(): FrameworkEvent { return this.__TickEvent; }
    private __TickEvent: FrameworkEvent;

    private __timeoutHandle: number;
}

/**
 * AutoScroller Class
 * Enables automatic scrolling for the framework widgets.
 */
export const AutoScrollerOrientation = new Enumeration([
    "Horizontal",
    "Vertical"
]);

export const AutoScrollerDirection = new Enumeration([
    "None",
    "Forward",
    "Backward"
]);

const AutoScrollerState = new Enumeration([
    "Ready",
    "ScrollNotified",
    "ScrollActive",
    "ScrollRejected"
]);

export class AutoScroller {
    constructor(target) {
        if (!target) throw new ArgumentNullException("target");
        if (!(target instanceof Element)) throw new ArgumentTypeException("target", target, Element);

        this.__target = target;

        this.__scrollTimer.TickEvent.attach(this.__scrollTimer_onTick, this);
        this.__scrollTimer.start();

        window.addEventListener("mousemove", this.__window_onMouseMove.bind(this));
    }

    private __doRequestScrollStart(args) {
        let scrollAccepted = false;

        this.ScrollRequestStartEvent.invoke(this, {
            acceptScroll() { scrollAccepted = true; },
            ...args
        });

        let orientation = args.orientation;

        if (scrollAccepted)
            this.__doScrollStart(args);
    }

    private __doScrollStart(args) {
        let { orientation, direction } = args;

        switch (orientation) {
            case AutoScrollerOrientation.Vertical:
                this.__directionY = direction;
                this.__stateY = AutoScrollerState.ScrollActive;
                break;

            case AutoScrollerOrientation.Horizontal:
                this.__directionX = direction;
                this.__stateX = AutoScrollerState.ScrollActive;
                break;
        }

        this.ScrollStartEvent.invoke(this, args);
    }

    private __doScrollRateChange(args) {
        let { orientation, rate } = args;

        switch (orientation) {
            case AutoScrollerOrientation.Vertical:
                this.__rateY = rate;
                break;

            case AutoScrollerOrientation.Horizontal:
                this.__rateX = rate;
                break;
        }

        this.ScrollRateChangeEvent.invoke(this, args);
    }

    private __doScrollEnd(args) {
        let orientation = args.orientation;

        switch (orientation) {
            case AutoScrollerOrientation.Vertical:
                this.__stateY = AutoScrollerState.Ready;
                this.__directionY = AutoScrollerDirection.None;
                break;

            case AutoScrollerOrientation.Horizontal:
                this.__stateX = AutoScrollerState.Ready;
                this.__directionX = AutoScrollerDirection.None;
                break;
        }

        this.ScrollEndEvent.invoke(this, args);
    }

    private __scrollTimer_onTick(sender, args) {
        let directionX = this.__directionX,
            directionY = this.__directionY,
            rateX = this.__rateX,
            rateY = this.__rateY;

        if (directionX === AutoScrollerDirection.None &&
            directionY === AutoScrollerDirection.None) return;

        this.target.scrollBy(directionX === AutoScrollerDirection.Forward ? rateX : -rateX,
            directionY === AutoScrollerDirection.Forward ? rateY : -rateY);
    }

    private __window_onMouseMove(evt) {
        const SCROLL_REGION_OFFSET = 50;

        let { clientX, clientY } = evt;

        let computedStyle = getComputedStyle(this.target);

        let canScrollX = computedStyle.overflowX === "scroll" || computedStyle.overflowX === "auto",
            canScrollY = computedStyle.overflowY === "scroll" || computedStyle.overflowY === "auto";

        if (!canScrollX && !canScrollY) return;

        let cursorPos = new DOMPoint(clientX, clientY);

        let clientRect = this.target.getBoundingClientRect();

        let topScrollRegion = Utils.clipRectSide(clientRect, "top", SCROLL_REGION_OFFSET),
            rightScrollRegion = Utils.clipRectSide(clientRect, "right", SCROLL_REGION_OFFSET),
            bottomScrollRegion = Utils.clipRectSide(clientRect, "bottom", SCROLL_REGION_OFFSET),
            leftScrollRegion = Utils.clipRectSide(clientRect, "left", SCROLL_REGION_OFFSET);

        let cursorIsInTopScrollRegion = Utils.pointInRect(topScrollRegion, cursorPos),
            cursorIsInRightScrollRegion = Utils.pointInRect(rightScrollRegion, cursorPos),
            cursorIsInBottomScrollRegion = Utils.pointInRect(bottomScrollRegion, cursorPos),
            cursorIsInLeftScrollRegion = Utils.pointInRect(leftScrollRegion, cursorPos);

        let directionX = this.__directionX, directionY = this.__directionY;

        let stateX = this.__stateX, stateY = this.__stateY;

        switch (stateX) {
            case AutoScrollerState.Ready: //Horizontal scroll is ready
                if (canScrollX) { //Horizontal scroll is possible, check if cursor is inside any of the 
                    //horizontal scrolling zones
                    if (cursorIsInRightScrollRegion) //Cursor is inside the right zone, request 
                        //scrolling right
                        this.__doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Horizontal,
                            direction: AutoScrollerDirection.Forward
                        });
                    else if (cursorIsInLeftScrollRegion) //Cursor is inside the left zone, request
                        //scrolling left
                        this.__doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Horizontal,
                            direction: AutoScrollerDirection.Backward
                        });
                }
                break;

            case AutoScrollerState.ScrollActive: //Horizontal scroll is active
                if (cursorIsInRightScrollRegion && directionX === AutoScrollerDirection.Forward && canScrollX)
                    //Cursor remains in the right scroll region and horizontal scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: AutoScrollerOrientation.Horizontal,
                        rate: cursorPos.x - rightScrollRegion.left
                    });
                else if (cursorIsInLeftScrollRegion && directionX === AutoScrollerDirection.Backward && canScrollX)
                    //Cursor remains in the left scroll region and horizontal scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: AutoScrollerOrientation.Horizontal,
                        rate: leftScrollRegion.right - cursorPos.x
                    });
                else //Cursor left the active horizontal scrolling region, finish scrolling
                    this.__doScrollEnd({
                        orientation: AutoScrollerOrientation.Horizontal
                    });
                break;
        }

        switch (stateY) {
            case AutoScrollerState.Ready: //Vertical scroll is ready
                if (canScrollY) { //Vertical scroll is possible, check if cursor is inside any of the 
                    //vertical scrolling zones
                    if (cursorIsInTopScrollRegion) //Cursor is inside the top zone, request scrolling up
                        this.__doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Vertical,
                            direction: AutoScrollerDirection.Backward
                        });
                    else if (cursorIsInBottomScrollRegion) //Cursor is inside the bottom zone. Request 
                        //scrolling down
                        this.__doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Vertical,
                            direction: AutoScrollerDirection.Forward
                        });
                }
                break;

            case AutoScrollerState.ScrollActive: //Vertical scroll is acrive
                if (cursorIsInTopScrollRegion && directionY === AutoScrollerDirection.Backward && canScrollY)
                    //Cursor remains in the top scroll region and vertical scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: AutoScrollerOrientation.Vertical,
                        rate: topScrollRegion.bottom - cursorPos.y
                    });
                else if (cursorIsInBottomScrollRegion && directionY === AutoScrollerDirection.Forward && canScrollY)
                    //Cursor remains in the bottom scroll region and vertical scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: AutoScrollerOrientation.Vertical,
                        rate: cursorPos.y - bottomScrollRegion.top
                    });
                else //Cursor left the active vertical scrolling zone, finish scrolling
                    this.__doScrollEnd({
                        orientation: AutoScrollerOrientation.Vertical
                    });
                break;
        }
    }

    private __target_onMouseLeave(evt) {
        switch (this.__stateY) {
            case AutoScrollerState.ScrollActive:
                this.__doScrollEnd({
                    orientation: AutoScrollerOrientation.Vertical
                });
        }

        switch (this.__stateX) {
            case AutoScrollerState.ScrollActive:
                this.__doScrollEnd({
                    orientation: AutoScrollerOrientation.Horizontal
                });
        }
    }

    private __ScrollRequestStartEvent = new FrameworkEvent();
    private __ScrollStartEvent = new FrameworkEvent();
    private __ScrollRateChangeEvent = new FrameworkEvent();
    private __ScrollEndEvent = new FrameworkEvent();

    private __scrollTimer = new Timer(10, true);

    private __rateX = 0;
    private __rateY = 0;

    private __stateX = AutoScrollerState.Ready;
    private __stateY = AutoScrollerState.Ready;
    private __directionX = AutoScrollerDirection.None;
    private __directionY = AutoScrollerDirection.None;

    get ScrollRequestStartEvent() { return this.__ScrollRequestStartEvent; }
    get ScrollStartEvent() { return this.__ScrollStartEvent; }
    get ScrollRateChangeEvent() { return this.__ScrollRateChangeEvent; }
    get ScrollEndEvent() { return this.__ScrollEndEvent; }

    get target(): Element { return this.__target; }
    private __target: Element;
}

/**
 * 
 */
class DragEmulator {
    constructor(handler) {
        if (!handler instanceof DragDropHandler) throw new ArgumentTypeException("handler", handler, DragDropHandler);

        handler.DragStartEvent.attach(this.DragStartEvent);
        handler.DragMoveEvent.attach(this.DragMoveEvent);
        handler.DragEndEvent.attach(this.DragEndEvent);
        handler.DragCancelEvent.attach(this.DragCancelEvent);

        this.handler = handler;
    }

    createPreviewElem(args) {
        let targetElem = this.handler.target;

        let previewElem = targetElem.cloneNode(true);
        previewElem.style.position = "absolute";
        previewElem.style.opacity = ".6";
        previewElem.style.zIndex = "9999";
        document.body.appendChild(previewElem);

        this.previewElem = previewElem;

        this.repositionPreviewElem(args);
    }

    repositionPreviewElem(args) {
        const previewElem = this.previewElem;
        if (!previewElem) return;

        let { left, top } = args;

        previewElem.style.left = `${left}px`;
        previewElem.style.top = `${top}px`;
    }

    removePreviewElement() {
        const previewElem = this.previewElem;
        if (!previewElem) return;

        previewElem.remove();

        this.previewElem = null;
    }

    onDragStart(sender, args) {
        let targetElem = this.handler.target;

        let { clientX, clientY } = args;

        let { left, top } = targetElem.getBoundingClientRect();

        this.createPreviewElem({
            left, top
        });

        this.initialLeft = left;
        this.initialTop = top;
        this.initialClientX = clientX;
        this.initialClientY = clientY;
    }

    onDragMove(sender, args) {
        let { clientX, clientY } = args;

        let left = this.initialLeft + clientX - this.initialClientX;
        let top = this.initialTop + clientY - this.initialClientY;

        this.repositionPreviewElem({
            left,
            top
        });
    }

    onDragEnd(sender, args) {
        this.removePreviewElement();
    }

    onDragCancel(sender, args) {
        this.removePreviewElement();
    }

    DragStartEvent = new FrameworkEvent(this.onDragStart.bind(this));
    DragMoveEvent = new FrameworkEvent(this.onDragMove.bind(this));
    DragEndEvent = new FrameworkEvent(this.onDragEnd.bind(this));
    DragCancelEvent = new FrameworkEvent(this.onDragCancel.bind(this));

    previewElem = null;
}

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
        if (evt.touches.length !== 1) return;

        this._touchDragDelayTimer.start();
    }

    _onTouchMove(evt) {
        this._touchDragDelayTimer.stop();

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

        this.DragStartEvent.invoke(this, {
            setData(value) { data = value; },
            setContext(value) { context = value; },
            ...args
        });

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

        this.DragEnterEvent.invoke(this, {
            getContext() { return context; },
            acceptDrop() { acceptsDrop = true; },
            ...args
        });

        context = null;

        this._acceptsDrop = acceptsDrop;
    }

    _doDragOver(args) {
        this.DragOverEvent.invoke(this, {
            ...args
        });
    }

    _doDragLeave(args) {
        this.DragLeaveEvent.invoke(this, {
            ...args
        });
    }

    _doDragDrop(args) {
        let { _sourceHandler: sourceHandler } = args;

        let data = sourceHandler._data;

        this.DragDropEvent.invoke(this, {
            getData() { return data; },
            ...args
        });

        data = null;
    }

    _onNotifyDragMove(sender, args) {
        if (sender === this) return;

        let { clientX, clientY } = args;

        let visibleRect = Utils.getElementVisibleRect(this.target);

        let cursorIsOver = Utils.pointInRect(visibleRect, new DOMPoint(clientX, clientY));

        switch (this._state) {
            case DragDropHandlerState.Ready:
            case DragDropHandlerState.DropDragOut:
                if (cursorIsOver) {
                    this._doDragEnter({
                        _sourceHandler: sender,
                        ...args
                    });

                    if (this._acceptsDrop)
                        this._state = DragDropHandlerState.DropDragIn;
                    else
                        this._state = DragDropHandlerState.DropRejected;
                }
                break;

            case DragDropHandlerState.DropDragIn:
                this._doDragOver({
                    _sourceHandler: sender,
                    ...args
                });

                if (!cursorIsOver) {
                    this._doDragLeave({
                        _sourceHandler: sender,
                        ...args
                    });

                    this._state = DragDropHandlerState.DropDragOut;
                }
                break;
        }
    }

    _onNotifyDragEnd(sender, args) {
        if (sender === this) return;

        let _args = {
            _sourceHandler: sender,
            ...args
        };

        switch (this._state) {
            case DragDropHandlerState.DropDragIn:

                this._doDragDrop(_args);
                break;

            case DragDropHandlerState.DropRejected:
                this._state = DragDropHandlerState.Ready;

                break;
        }
    }

    _NotifyDragStartEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragStart");
    _NotifyDragMoveEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragMove", this._onNotifyDragMove.bind(this));
    _NotifyDragEndEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragEnd", this._onNotifyDragEnd.bind(this));
    _NotifyDragCancelEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragCancel");

    _RequestDragStartEvent = new FrameworkEvent();
    _DragStartEvent = new FrameworkEvent();
    _DragMoveEvent = new FrameworkEvent();
    _DragEndEvent = new FrameworkEvent();
    _DragCancelEvent = new FrameworkEvent();

    _DragEnterEvent = new FrameworkEvent();
    _DragOverEvent = new FrameworkEvent();
    _DragLeaveEvent = new FrameworkEvent();
    _DragDropEvent = new FrameworkEvent();

    _emulator = new DragEmulator(this);

    _data = null;
    _context = null;

    _state = DragDropHandlerState.Ready;

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