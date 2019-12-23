﻿import { Enumeration } from "../Standard/Enumeration";
import { ArgumentNullException, ArgumentTypeException } from "../Standard/Exceptions";
import { FrameworkEvent } from "../Standard/Events";
import { Timer, Utils } from "./user-interface";
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
/**
 * AutoScroller Class
 * Enables automatic scrolling for the framework widgets.
 */
export class AutoScroller {
    constructor(target) {
        this.__ScrollRequestStartEvent = new FrameworkEvent();
        this.__ScrollStartEvent = new FrameworkEvent();
        this.__ScrollRateChangeEvent = new FrameworkEvent();
        this.__ScrollEndEvent = new FrameworkEvent();
        this.__scrollTimer = new Timer(10, true);
        this.__rateX = 0;
        this.__rateY = 0;
        this.__stateX = AutoScrollerState.Ready;
        this.__stateY = AutoScrollerState.Ready;
        this.__directionX = AutoScrollerDirection.None;
        this.__directionY = AutoScrollerDirection.None;
        if (!target)
            throw new ArgumentNullException("target");
        if (!(target instanceof Element))
            throw new ArgumentTypeException("target", target, Element);
        this.__target = target;
        this.__scrollTimer.TickEvent.attach(this.__scrollTimer_onTick, this);
        this.__scrollTimer.start();
        window.addEventListener("mousemove", this.__window_onMouseMove.bind(this));
    }
    __doRequestScrollStart(args) {
        let scrollAccepted = false;
        this.ScrollRequestStartEvent.invoke(this, Object.assign({ acceptScroll() { scrollAccepted = true; } }, args));
        let orientation = args.orientation;
        if (scrollAccepted)
            this.__doScrollStart(args);
    }
    __doScrollStart(args) {
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
    __doScrollRateChange(args) {
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
    __doScrollEnd(args) {
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
    __scrollTimer_onTick(sender, args) {
        let directionX = this.__directionX, directionY = this.__directionY, rateX = this.__rateX, rateY = this.__rateY;
        if (directionX === AutoScrollerDirection.None &&
            directionY === AutoScrollerDirection.None)
            return;
        this.target.scrollBy(directionX === AutoScrollerDirection.Forward ? rateX : -rateX, directionY === AutoScrollerDirection.Forward ? rateY : -rateY);
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
        let topScrollRegion = Utils.clipRectSide(clientRect, "top", SCROLL_REGION_OFFSET), rightScrollRegion = Utils.clipRectSide(clientRect, "right", SCROLL_REGION_OFFSET), bottomScrollRegion = Utils.clipRectSide(clientRect, "bottom", SCROLL_REGION_OFFSET), leftScrollRegion = Utils.clipRectSide(clientRect, "left", SCROLL_REGION_OFFSET);
        let cursorIsInTopScrollRegion = Utils.pointInRect(topScrollRegion, cursorPos), cursorIsInRightScrollRegion = Utils.pointInRect(rightScrollRegion, cursorPos), cursorIsInBottomScrollRegion = Utils.pointInRect(bottomScrollRegion, cursorPos), cursorIsInLeftScrollRegion = Utils.pointInRect(leftScrollRegion, cursorPos);
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
    __target_onMouseLeave(evt) {
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
    get ScrollRequestStartEvent() { return this.__ScrollRequestStartEvent; }
    get ScrollStartEvent() { return this.__ScrollStartEvent; }
    get ScrollRateChangeEvent() { return this.__ScrollRateChangeEvent; }
    get ScrollEndEvent() { return this.__ScrollEndEvent; }
    get target() { return this.__target; }
}
