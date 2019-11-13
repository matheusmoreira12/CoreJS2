import { ValueConverter, ContextSelectionFlags, IValueConverter } from "./standard.js";
import { Collection } from "./Standard.Collections.js";
import { ArgumentTypeException, InvalidOperationException, ArgumentNullException } from "./exceptions.js";
import { FrameworkEvent, BroadcastFrameworkEvent } from "./Standard.Events.js";
import { Enumeration } from "./Standard.Enumeration.js";

export class BooleanAttributeValueConverter extends ValueConverter {
    convertBack(value) {
        if (value === null) return null;

        if (value === "false") return false;

        return true;
    }

    convert(value) {
        if (value === null) return null;

        if (value === false) return "false";

        return "";
    }
}

export class JSONAttributeValueConverter extends ValueConverter {
    convertBack(value) {
        return JSON.parse(value);
    }

    convert(value) {
        return JSON.stringify(value);
    }
}

export class FlagsAttributeValueConverter extends ValueConverter {
    convertBack(value) {
        return ContextSelectionFlags.parse(value);
    }

    convert(value) {
        return value.toString();
    }
}

export class EnumerationAttributeValueConverter extends ValueConverter {
    constructor(enumeration) {
        super();

        this._enumeration = enumeration;
    }

    convertBack(value) {
        if (value === null) return null;

        return this._enumeration.parse(value);
    }

    convert(value) {
        if (value === null) return null;

        return this._enumeration.convertToString(value);
    }
}

/**
 * FrameworkProperty class
 * Eases the integration between user-defined properties and framework features.
 */
const DEFAULT_FRAMEWORK_PROPERTY_OPTIONS = {
    defaultValue: null
};

export class FrameworkProperty {
    static *getAllProperties(type) {
        const PROPERTY_NAME_PATTERN = /^([a-zA-Z]\w*)Property$/;

        for (let staticPropName of Object.getOwnPropertyNames(type)) {
            let staticProp = Object.getOwnPropertyDescriptor(type, staticPropName);

            if (!staticPropName.match(PROPERTY_NAME_PATTERN)) continue;

            if (!(staticProp.value instanceof FrameworkProperty)) continue;

            yield staticProp.value;
        }

        if (type.prototype)
            yield* this.getAllProperties(type.prototype);
    }

    constructor(name, options) {
        options = Object.assign({}, DEFAULT_FRAMEWORK_PROPERTY_OPTIONS, options);

        this._name = name;
        this._options = options;
    }

    _storedValues = new WeakMap();

    get(target) {
        let storedValues = this._storedValues;

        if (!storedValues.has(target))
            return this._options.defaultValue;

        return storedValues.get(target);
    }

    set(target, value) {
        let storedValues = this._storedValues;

        let oldValue = this.get(target);

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

    get name() { return this._name; }

    get options() { return this._options; }
}

/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export class FrameworkAction {
    constructor() {
        if (this.constructor === FrameworkAction) throw new InvalidOperationException("Invalid constructor");
    }

    execute() {
        this.ExecutedEvent.invoke(this);
    }

    _ExecutedEvent = new FrameworkEvent();

    get ExecutedEvent() { return this._ExecutedEvent; }
}

/**
 * 
 */
export class Setter {

}

/**
 * Trigger base class
 */

export class Trigger {
    constructor(...actions) {
        if (this.constructor === Trigger) throw new InvalidOperationException("Invalid constructor");

        if (!(this.action instanceof FrameworkAction)) throw new ArgumentTypeException("action", action,
            FrameworkAction);

        this._actions = new Collection(actions);
    }

    get actions() { return this._actions; }
}

/**
 * PropertyTrigger class
 * Triggers a group of action when the specified property matches the specified value.
 */

export class PropertyTrigger extends Trigger {
    constructor(target, targetProperty, value, ...actions) {
        if (typeof target !== "object") throw new ArgumentTypeException("target", target, Object);

        if (!(targetProperty instanceof FrameworkProperty)) throw new ArgumentTypeException("targetProperty",
            targetProperty, FrameworkProperty);

        this._target = target;
        this._targetProperty = targetProperty;
        this._value = value;

        targetProperty.ChangeEvent.attach(this._targetProperty_onChange, this);
    }

    _targetProperty_onChange(sender, args) {
        if (!Object.is(args.target, this.target)) return;

        let newValue = args.newValue;

        if (newValue !== this.value) return;

        this.action.execute();
    }

    get target() { return this._target; }
    get targetProperty() { return this._targetProperty; }
    get value() { return this._value; }
}

/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export class EventTrigger {
    constructor(targetEvent) {
        if (!(targetEvent instanceof FrameworkEvent)) throw new ArgumentTypeException("targetEvent",
            targetEvent, FrameworkEvent);

        this._targetEvent = targetEvent;

        targetEvent.attach(this._targetEvent_handler, this);
    }

    _targetEvent_handler() {
        this.action.execute();
    }

    get targetEvent() { return this._targetEvent; }
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

export class IdentifierGenerator {
    constructor(prefix) {

        this._usedNumbers = new Set();
        this._prefix = prefix;
    }

    create() {
        let number = 0;

        while (this._usedNumbers.has(number)) number++;

        this._usedNumbers.add(number);

        return `${this._prefix}${number}`;
    }

    delete(id) {
        if (!id.startsWith(this._prefix)) return;

        let number = id.replace(this._prefix, "") * 1;

        this._usedNumbers.delete(number);
    }
}

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
        this._delayMillis = delayMillis;
        this._isPeriodic = isPeriodic;
    }

    start() {
        this.stop();

        function onTimeout() {
            this._TickEvent.invoke(this);

            if (this.isPeriodic)
                this.start();
        }

        this._timeoutHandle = setTimeout(onTimeout.bind(this), this.delayMillis);
    }

    stop() {
        if (!this._timeoutHandle) return;

        clearTimeout(this._timeoutHandle);

        this._timeoutHandle = null;
    }

    _TickEvent = new FrameworkEvent();

    get delayMillis() { return this._delayMillis; }
    get isPeriodic() { return this._isPeriodic; }

    get TickEvent() { return this._TickEvent; }
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

        this._target = target;

        this._scrollTimer.TickEvent.attach(this._scrollTimer_onTick, this);
        this._scrollTimer.start();

        window.addEventListener("mousemove", this._window_onMouseMove.bind(this));
    }

    _doRequestScrollStart(args) {
        let scrollAccepted = false;

        this.ScrollRequestStartEvent.invoke(this, {
            acceptScroll() { scrollAccepted = true; },
            ...args
        });

        let orientation = args.orientation;

        if (scrollAccepted)
            this._doScrollStart(args);
    }

    _doScrollStart(args) {
        let { orientation, direction } = args;

        switch (orientation) {
            case AutoScrollerOrientation.Vertical:
                this._directionY = direction;
                this._stateY = AutoScrollerState.ScrollActive;
                break;

            case AutoScrollerOrientation.Horizontal:
                this._directionX = direction;
                this._stateX = AutoScrollerState.ScrollActive;
                break;
        }

        this.ScrollStartEvent.invoke(this, args);
    }

    _doScrollRateChange(args) {
        let { orientation, rate } = args;

        switch (orientation) {
            case AutoScrollerOrientation.Vertical:
                this._rateY = rate;
                break;

            case AutoScrollerOrientation.Horizontal:
                this._rateX = rate;
                break;
        }

        this.ScrollRateChangeEvent.invoke(this, args);
    }

    _doScrollEnd(args) {
        let orientation = args.orientation;

        switch (orientation) {
            case AutoScrollerOrientation.Vertical:
                this._stateY = AutoScrollerState.Ready;
                this._directionY = AutoScrollerDirection.None;
                break;

            case AutoScrollerOrientation.Horizontal:
                this._stateX = AutoScrollerState.Ready;
                this._directionX = AutoScrollerDirection.None;
                break;
        }

        this.ScrollEndEvent.invoke(this, args);
    }

    _scrollTimer_onTick(sender, args) {
        let directionX = this._directionX,
            directionY = this._directionY,
            rateX = this._rateX,
            rateY = this._rateY;

        if (directionX === AutoScrollerDirection.None &&
            directionY === AutoScrollerDirection.None) return;

        this.target.scrollBy(directionX === AutoScrollerDirection.Forward ? rateX : -rateX,
            directionY === AutoScrollerDirection.Forward ? rateY : -rateY);
    }

    _RequestScrollStartEvent = new FrameworkEvent();
    _ScrollStartEvent = new FrameworkEvent();
    _ScrollRateChangeEvent = new FrameworkEvent();
    _ScrollEndEvent = new FrameworkEvent();

    _scrollTimer = new Timer(10, true);

    _rateX = 0;
    _rateY = 0;

    _stateX = AutoScrollerState.Ready;
    _stateY = AutoScrollerState.Ready;
    _directionX = AutoScrollerDirection.None;
    _directionY = AutoScrollerDirection.None;

    _window_onMouseMove(evt) {
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

        let directionX = this._directionX, directionY = this._directionY;

        let stateX = this._stateX, stateY = this._stateY;

        switch (stateX) {
            case AutoScrollerState.Ready: //Horizontal scroll is ready
                if (canScrollX) { //Horizontal scroll is possible, check if cursor is inside any of the 
                    //horizontal scrolling zones
                    if (cursorIsInRightScrollRegion) //Cursor is inside the right zone, request 
                        //scrolling right
                        this._doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Horizontal,
                            direction: AutoScrollerDirection.Forward
                        });
                    else if (cursorIsInLeftScrollRegion) //Cursor is inside the left zone, request
                        //scrolling left
                        this._doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Horizontal,
                            direction: AutoScrollerDirection.Backward
                        });
                }
                break;

            case AutoScrollerState.ScrollActive: //Horizontal scroll is active
                if (cursorIsInRightScrollRegion && directionX === AutoScrollerDirection.Forward && canScrollX)
                    //Cursor remains in the right scroll region and horizontal scroll is still possible, 
                    //carry on and update scrolling rate
                    this._doScrollRateChange({
                        orientation: AutoScrollerOrientation.Horizontal,
                        rate: cursorPos.x - rightScrollRegion.left
                    });
                else if (cursorIsInLeftScrollRegion && directionX === AutoScrollerDirection.Backward && canScrollX)
                    //Cursor remains in the left scroll region and horizontal scroll is still possible, 
                    //carry on and update scrolling rate
                    this._doScrollRateChange({
                        orientation: AutoScrollerOrientation.Horizontal,
                        rate: leftScrollRegion.right - cursorPos.x
                    });
                else //Cursor left the active horizontal scrolling region, finish scrolling
                    this._doScrollEnd({
                        orientation: AutoScrollerOrientation.Horizontal
                    });
                break;
        }

        switch (stateY) {
            case AutoScrollerState.Ready: //Vertical scroll is ready
                if (canScrollY) { //Vertical scroll is possible, check if cursor is inside any of the 
                    //vertical scrolling zones
                    if (cursorIsInTopScrollRegion) //Cursor is inside the top zone, request scrolling up
                        this._doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Vertical,
                            direction: AutoScrollerDirection.Backward
                        });
                    else if (cursorIsInBottomScrollRegion) //Cursor is inside the bottom zone. Request 
                        //scrolling down
                        this._doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Vertical,
                            direction: AutoScrollerDirection.Forward
                        });
                }
                break;

            case AutoScrollerState.ScrollActive: //Vertical scroll is acrive
                if (cursorIsInTopScrollRegion && directionY === AutoScrollerDirection.Backward && canScrollY)
                    //Cursor remains in the top scroll region and vertical scroll is still possible, 
                    //carry on and update scrolling rate
                    this._doScrollRateChange({
                        orientation: AutoScrollerOrientation.Vertical,
                        rate: topScrollRegion.bottom - cursorPos.y
                    });
                else if (cursorIsInBottomScrollRegion && directionY === AutoScrollerDirection.Forward && canScrollY)
                    //Cursor remains in the bottom scroll region and vertical scroll is still possible, 
                    //carry on and update scrolling rate
                    this._doScrollRateChange({
                        orientation: AutoScrollerOrientation.Vertical,
                        rate: cursorPos.y - bottomScrollRegion.top
                    });
                else //Cursor left the active vertical scrolling zone, finish scrolling
                    this._doScrollEnd({
                        orientation: AutoScrollerOrientation.Vertical
                    });
                break;
        }
    }

    _target_onMouseLeave(evt) {
        switch (this._stateY) {
            case AutoScrollerState.ScrollActive:
                this._doScrollEnd({
                    orientation: AutoScrollerOrientation.Vertical
                });
        }

        switch (this._stateX) {
            case AutoScrollerState.ScrollActive:
                this._doScrollEnd({
                    orientation: AutoScrollerOrientation.Horizontal
                });
        }
    }

    get ScrollRequestStartEvent() { return this._RequestScrollStartEvent; }
    get ScrollStartEvent() { return this._ScrollStartEvent; }
    get ScrollRateChangeEvent() { return this._ScrollRateChangeEvent; }
    get ScrollEndEvent() { return this._ScrollEndEvent; }

    get target() { return this._target; }
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