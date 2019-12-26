"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enumeration_1 = require("../Standard/Enumeration");
const Exceptions_1 = require("../Standard/Exceptions");
const Events_1 = require("../Standard/Events");
const user_interface_1 = require("./user-interface");
exports.AutoScrollerOrientation = new Enumeration_1.Enumeration([
    "Horizontal",
    "Vertical"
]);
exports.AutoScrollerDirection = new Enumeration_1.Enumeration([
    "None",
    "Forward",
    "Backward"
]);
const AutoScrollerState = new Enumeration_1.Enumeration([
    "Ready",
    "ScrollNotified",
    "ScrollActive",
    "ScrollRejected"
]);
/**
 * AutoScroller Class
 * Enables automatic scrolling for the framework widgets.
 */
class AutoScroller {
    constructor(target) {
        this.__ScrollRequestStartEvent = new Events_1.FrameworkEvent();
        this.__ScrollStartEvent = new Events_1.FrameworkEvent();
        this.__ScrollRateChangeEvent = new Events_1.FrameworkEvent();
        this.__ScrollEndEvent = new Events_1.FrameworkEvent();
        this.__scrollTimer = new user_interface_1.Timer(10, true);
        this.__rateX = 0;
        this.__rateY = 0;
        this.__stateX = AutoScrollerState.Ready;
        this.__stateY = AutoScrollerState.Ready;
        this.__directionX = exports.AutoScrollerDirection.None;
        this.__directionY = exports.AutoScrollerDirection.None;
        if (!target)
            throw new Exceptions_1.ArgumentNullException("target");
        if (!(target instanceof Element))
            throw new Exceptions_1.ArgumentTypeException("target", target, Element);
        this.__target = target;
        this.__scrollTimer.TickEvent.attach(this.__scrollTimer_onTick, this);
        this.__scrollTimer.start();
        window.addEventListener("mousemove", this.__window_onMouseMove.bind(this));
    }
    __doRequestScrollStart(args) {
        let scrollAccepted = false;
        this.ScrollRequestStartEvent.invoke(this, Object.assign({ acceptScroll() { scrollAccepted = true; } }, args));
        if (scrollAccepted)
            this.__doScrollStart(args);
    }
    __doScrollStart(args) {
        let { orientation, direction } = args;
        switch (orientation) {
            case exports.AutoScrollerOrientation.Vertical:
                this.__directionY = direction;
                this.__stateY = AutoScrollerState.ScrollActive;
                break;
            case exports.AutoScrollerOrientation.Horizontal:
                this.__directionX = direction;
                this.__stateX = AutoScrollerState.ScrollActive;
                break;
        }
        this.ScrollStartEvent.invoke(this, args);
    }
    __doScrollRateChange(args) {
        let { orientation, rate } = args;
        switch (orientation) {
            case exports.AutoScrollerOrientation.Vertical:
                this.__rateY = rate;
                break;
            case exports.AutoScrollerOrientation.Horizontal:
                this.__rateX = rate;
                break;
        }
        this.ScrollRateChangeEvent.invoke(this, args);
    }
    __doScrollEnd(args) {
        let orientation = args.orientation;
        switch (orientation) {
            case exports.AutoScrollerOrientation.Vertical:
                this.__stateY = AutoScrollerState.Ready;
                this.__directionY = exports.AutoScrollerDirection.None;
                break;
            case exports.AutoScrollerOrientation.Horizontal:
                this.__stateX = AutoScrollerState.Ready;
                this.__directionX = exports.AutoScrollerDirection.None;
                break;
        }
        this.ScrollEndEvent.invoke(this, args);
    }
    __scrollTimer_onTick(sender, args) {
        let directionX = this.__directionX, directionY = this.__directionY, rateX = this.__rateX, rateY = this.__rateY;
        if (directionX === exports.AutoScrollerDirection.None &&
            directionY === exports.AutoScrollerDirection.None)
            return;
        this.target.scrollBy(directionX === exports.AutoScrollerDirection.Forward ? rateX : -rateX, directionY === exports.AutoScrollerDirection.Forward ? rateY : -rateY);
    }
    __window_onMouseMove(evt) {
        const SCROLL_REGION_OFFSET = 50;
        let { clientX, clientY } = evt;
        let computedStyle = getComputedStyle(this.target);
        let canScrollX = computedStyle.overflowX === "scroll" || computedStyle.overflowX === "auto", canScrollY = computedStyle.overflowY === "scroll" || computedStyle.overflowY === "auto";
        if (!canScrollX && !canScrollY)
            return;
        let cursorPos = new DOMPoint(clientX, clientY);
        let clientRect = this.target.getBoundingClientRect();
        let topScrollRegion = user_interface_1.Utils.clipRectSide(clientRect, "top", SCROLL_REGION_OFFSET), rightScrollRegion = user_interface_1.Utils.clipRectSide(clientRect, "right", SCROLL_REGION_OFFSET), bottomScrollRegion = user_interface_1.Utils.clipRectSide(clientRect, "bottom", SCROLL_REGION_OFFSET), leftScrollRegion = user_interface_1.Utils.clipRectSide(clientRect, "left", SCROLL_REGION_OFFSET);
        let cursorIsInTopScrollRegion = user_interface_1.Utils.pointInRect(topScrollRegion, cursorPos), cursorIsInRightScrollRegion = user_interface_1.Utils.pointInRect(rightScrollRegion, cursorPos), cursorIsInBottomScrollRegion = user_interface_1.Utils.pointInRect(bottomScrollRegion, cursorPos), cursorIsInLeftScrollRegion = user_interface_1.Utils.pointInRect(leftScrollRegion, cursorPos);
        let directionX = this.__directionX, directionY = this.__directionY;
        let stateX = this.__stateX, stateY = this.__stateY;
        switch (stateX) {
            case AutoScrollerState.Ready: //Horizontal scroll is ready
                if (canScrollX) { //Horizontal scroll is possible, check if cursor is inside any of the 
                    //horizontal scrolling zones
                    if (cursorIsInRightScrollRegion) //Cursor is inside the right zone, request 
                        //scrolling right
                        this.__doRequestScrollStart({
                            orientation: exports.AutoScrollerOrientation.Horizontal,
                            direction: exports.AutoScrollerDirection.Forward
                        });
                    else if (cursorIsInLeftScrollRegion) //Cursor is inside the left zone, request
                        //scrolling left
                        this.__doRequestScrollStart({
                            orientation: exports.AutoScrollerOrientation.Horizontal,
                            direction: exports.AutoScrollerDirection.Backward
                        });
                }
                break;
            case AutoScrollerState.ScrollActive: //Horizontal scroll is active
                if (cursorIsInRightScrollRegion && directionX === exports.AutoScrollerDirection.Forward && canScrollX)
                    //Cursor remains in the right scroll region and horizontal scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: exports.AutoScrollerOrientation.Horizontal,
                        rate: cursorPos.x - rightScrollRegion.left
                    });
                else if (cursorIsInLeftScrollRegion && directionX === exports.AutoScrollerDirection.Backward && canScrollX)
                    //Cursor remains in the left scroll region and horizontal scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: exports.AutoScrollerOrientation.Horizontal,
                        rate: leftScrollRegion.right - cursorPos.x
                    });
                else //Cursor left the active horizontal scrolling region, finish scrolling
                    this.__doScrollEnd({
                        orientation: exports.AutoScrollerOrientation.Horizontal
                    });
                break;
        }
        switch (stateY) {
            case AutoScrollerState.Ready: //Vertical scroll is ready
                if (canScrollY) { //Vertical scroll is possible, check if cursor is inside any of the 
                    //vertical scrolling zones
                    if (cursorIsInTopScrollRegion) //Cursor is inside the top zone, request scrolling up
                        this.__doRequestScrollStart({
                            orientation: exports.AutoScrollerOrientation.Vertical,
                            direction: exports.AutoScrollerDirection.Backward
                        });
                    else if (cursorIsInBottomScrollRegion) //Cursor is inside the bottom zone. Request 
                        //scrolling down
                        this.__doRequestScrollStart({
                            orientation: exports.AutoScrollerOrientation.Vertical,
                            direction: exports.AutoScrollerDirection.Forward
                        });
                }
                break;
            case AutoScrollerState.ScrollActive: //Vertical scroll is acrive
                if (cursorIsInTopScrollRegion && directionY === exports.AutoScrollerDirection.Backward && canScrollY)
                    //Cursor remains in the top scroll region and vertical scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: exports.AutoScrollerOrientation.Vertical,
                        rate: topScrollRegion.bottom - cursorPos.y
                    });
                else if (cursorIsInBottomScrollRegion && directionY === exports.AutoScrollerDirection.Forward && canScrollY)
                    //Cursor remains in the bottom scroll region and vertical scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: exports.AutoScrollerOrientation.Vertical,
                        rate: cursorPos.y - bottomScrollRegion.top
                    });
                else //Cursor left the active vertical scrolling zone, finish scrolling
                    this.__doScrollEnd({
                        orientation: exports.AutoScrollerOrientation.Vertical
                    });
                break;
        }
    }
    __target_onMouseLeave(evt) {
        switch (this.__stateY) {
            case AutoScrollerState.ScrollActive:
                this.__doScrollEnd({
                    orientation: exports.AutoScrollerOrientation.Vertical
                });
        }
        switch (this.__stateX) {
            case AutoScrollerState.ScrollActive:
                this.__doScrollEnd({
                    orientation: exports.AutoScrollerOrientation.Horizontal
                });
        }
    }
    get ScrollRequestStartEvent() { return this.__ScrollRequestStartEvent; }
    get ScrollStartEvent() { return this.__ScrollStartEvent; }
    get ScrollRateChangeEvent() { return this.__ScrollRateChangeEvent; }
    get ScrollEndEvent() { return this.__ScrollEndEvent; }
    get target() { return this.__target; }
}
exports.AutoScroller = AutoScroller;
