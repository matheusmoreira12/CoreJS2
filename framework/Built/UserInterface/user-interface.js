"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ContextSelectionFlags_1 = require("../Standard/ContextSelectionFlags");
const Interface_1 = require("../Standard/Interfaces/Interface");
const Events_1 = require("../Standard/Events");
const Exceptions_1 = require("../Standard/Exceptions");
const Collections_1 = require("../Standard/Collections");
class BooleanAttributeValueConverter {
    convertBack(value) {
        if (value === null)
            return null;
        if (value === "false")
            return false;
        return true;
    }
    convert(value) {
        if (value === null)
            return null;
        if (value === false)
            return "false";
        return "";
    }
}
exports.BooleanAttributeValueConverter = BooleanAttributeValueConverter;
class JSONAttributeValueConverter {
    convertBack(value) {
        return JSON.parse(value);
    }
    convert(value) {
        return JSON.stringify(value);
    }
}
exports.JSONAttributeValueConverter = JSONAttributeValueConverter;
class FlagsAttributeValueConverter {
    convertBack(value) {
        return ContextSelectionFlags_1.ContextSelectionFlags.parse(value);
    }
    convert(value) {
        return value.toString();
    }
}
exports.FlagsAttributeValueConverter = FlagsAttributeValueConverter;
class EnumerationAttributeValueConverter {
    constructor(enumeration) {
        this.__enumeration = enumeration;
    }
    convertBack(value) {
        if (value === null)
            return null;
        return this.__enumeration.parse(value);
    }
    convert(value) {
        if (value === null)
            return null;
        return this.__enumeration.toString(value);
    }
}
exports.EnumerationAttributeValueConverter = EnumerationAttributeValueConverter;
const DEFAULT_FRAMEWORK_PROPERTY_OPTIONS = {
    defaultValue: null
};
exports.IFrameworkPropertyOptions = new Interface_1.Interface(new Interface_1.InterfaceMember("defaultValue", Interface_1.InterfaceMemberType.Property));
/**
 * FrameworkProperty class
 * Eases the integration between user-defined properties and framework features.
 */
class FrameworkProperty {
    constructor(name, options) {
        this.ChangeEvent = new Events_1.FrameworkEvent();
        this.__storedValues = new WeakMap();
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
    get name() { return this.__name; }
    get options() { return this.__options; }
}
exports.FrameworkProperty = FrameworkProperty;
/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
class FrameworkAction {
    constructor() {
        if (this.constructor === FrameworkAction)
            throw new Exceptions_1.InvalidOperationException("Invalid constructor");
        this.__ExecutedEvent = new Events_1.FrameworkEvent();
    }
    execute(data) {
        this.__ExecutedEvent.invoke(this, {
            data: data
        });
    }
    get ExecutedEvent() { return this.__ExecutedEvent; }
}
exports.FrameworkAction = FrameworkAction;
/**
 * Trigger base class
 */
class Trigger {
    constructor() {
        if (new.target === Trigger)
            throw new Exceptions_1.InvalidOperationException("Invalid constructor");
    }
}
exports.Trigger = Trigger;
/**
 *
 */
class Setter {
}
exports.Setter = Setter;
/**
 * PropertyTrigger class
 * Triggers a group of action when the specified property matches the specified value.
 */
class PropertyTrigger extends Trigger {
    constructor(target, targetProperty, value, ...actions) {
        super();
        if (typeof target !== "object")
            throw new Exceptions_1.ArgumentTypeException("target", target, Object);
        if (!(targetProperty instanceof FrameworkProperty))
            throw new Exceptions_1.ArgumentTypeException("targetProperty", targetProperty, FrameworkProperty);
        this.__target = target;
        this.__targetProperty = targetProperty;
        this.__value = value;
        targetProperty.ChangeEvent.attach(this.__targetProperty_onChange, this);
    }
    __targetProperty_onChange(sender, args) {
        if (args.target !== this.target)
            return;
        if (args.newValue !== this.value)
            return;
    }
    get target() { return this.__target; }
    get targetProperty() { return this.__targetProperty; }
    get value() { return this.__value; }
    get setters() { return this.__setters; }
}
exports.PropertyTrigger = PropertyTrigger;
/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
class EventTrigger extends Trigger {
    constructor(targetEvent, ...actions) {
        super();
        if (!(targetEvent instanceof Events_1.FrameworkEvent))
            throw new Exceptions_1.ArgumentTypeException("targetEvent", targetEvent, Events_1.FrameworkEvent);
        this.__targetEvent = targetEvent;
        this.__actions = new Collections_1.Collection(...actions);
        targetEvent.attach(this.__targetEvent_handler, this);
    }
    __targetEvent_handler() {
        this.__executeActions();
    }
    __executeActions(data) {
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
    get targetEvent() { return this.__targetEvent; }
    get actions() { return this.__actions; }
}
exports.EventTrigger = EventTrigger;
/**
 * Visual State Manager
 *  Manages the interactions between user interface and logic.
 */
class VisualStateManager {
    constructor() {
        this.serverTaskStartedEvent = new Events_1.BroadcastFrameworkEvent("ServerTask_started", this._onServerTaskStarted, this);
        this.serverTaskFinishedEvent = new Events_1.BroadcastFrameworkEvent("ServerTask_finished", this._onServerTaskFinished, this);
    }
    _onServerTaskStarted() {
        mainSpinner.hidden = false;
    }
    _onServerTaskFinished() {
        mainSpinner.hidden = true;
    }
}
exports.visualStateManager = new VisualStateManager();
/**
 *
 */
exports.Utils = {
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
        let topLeft2 = new DOMPoint(rect2.left, rect2.top), topRight2 = new DOMPoint(rect2.right, rect2.top), bottomRight2 = new DOMPoint(rect2.right, rect2.bottom), bottomLeft2 = new DOMPoint(rect2.left, rect2.bottom);
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
            if (result.left >= result.right || result.top >= result.bottom)
                break;
        }
        return result;
    }
};
/**
 *
 */
class Timer {
    constructor(delayMillis = 100, isPeriodic = true) {
        this._TickEvent = new Events_1.FrameworkEvent();
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
        if (!this.__timeoutHandle)
            return;
        clearTimeout(this.__timeoutHandle);
        this.__timeoutHandle = null;
    }
    get delayMillis() { return this.__delayMillis; }
    get isPeriodic() { return this.__isPeriodic; }
    get TickEvent() { return this.__TickEvent; }
}
exports.Timer = Timer;
