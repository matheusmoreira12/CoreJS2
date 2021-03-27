import { Enumeration } from "../standard/index.js";
import { ArgumentNullException, ArgumentTypeException } from "../standard/exceptions/index.js"
import { FrameworkEvent } from "../standard/events/index.js";
import { DOMUtils } from "./index.js";
import { Timer } from "../standard/timing/index.js";

export const AutoScrollerOrientation = Enumeration.create({
    Horizontal: null,
    Vertical: null,
});

export const AutoScrollerDirection = Enumeration.create({
    None: null,
    Forward: null,
    Backward: null,
});

const AutoScrollerState = Enumeration.create({
    Ready: null,
    ScrollNotified: null,
    ScrollActive: null,
    ScrollRejected: null,
});

/**
 * AutoScroller Class
 * Enables automatic scrolling for the framework widgets.
 */
export class AutoScroller {
    constructor(target: Element) {
        if (!target) throw new ArgumentNullException("target");
        if (!(target instanceof Element)) throw new ArgumentTypeException("target", target, Element);

        this.__target = target;

        this.__scrollTimer.TickEvent.attach(this.__scrollTimer_onTick, this);
        this.__scrollTimer.isEnabled = true;

        window.addEventListener("mousemove", this.__window_onMouseMove.bind(this));
    }

    private __doRequestScrollStart(args: { orientation: number, direction: number }) {
        let scrollAccepted = false;

        this.ScrollRequestStartEvent.invoke(this, {
            acceptScroll() { scrollAccepted = true; },
            ...args
        });

        if (scrollAccepted)
            this.__doScrollStart(args);
    }

    private __doScrollStart(args: { orientation: number, direction: number }) {
        switch (args.orientation) {
            case AutoScrollerOrientation.Vertical:
                this.__directionY = args.direction;
                this.__stateY = AutoScrollerState.ScrollActive;
                break;

            case AutoScrollerOrientation.Horizontal:
                this.__directionX = args.direction;
                this.__stateX = AutoScrollerState.ScrollActive;
                break;
        }

        this.ScrollStartEvent.invoke(this, args);
    }

    private __doScrollRateChange(args: { orientation: number, rate: number }) {
        switch (args.orientation) {
            case AutoScrollerOrientation.Vertical:
                this.__rateY = args.rate;
                break;

            case AutoScrollerOrientation.Horizontal:
                this.__rateX = args.rate;
                break;
        }

        this.ScrollRateChangeEvent.invoke(this, args);
    }

    private __doScrollEnd(args: { orientation: number }) {
        switch (args.orientation) {
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

    private __scrollTimer_onTick(sender: any, args: {}) {
        let directionX = this.__directionX,
            directionY = this.__directionY,
            rateX = this.__rateX,
            rateY = this.__rateY;

        if (directionX === AutoScrollerDirection.None &&
            directionY === AutoScrollerDirection.None) return;

        this.target.scrollBy(directionX === AutoScrollerDirection.Forward ? rateX : -rateX,
            directionY === AutoScrollerDirection.Forward ? rateY : -rateY);
    }

    private __window_onMouseMove(evt: Event) {
        const SCROLL_REGION_OFFSET = 50;

        const clientX = (<MouseEvent>evt).clientX,
            clientY = (<MouseEvent>evt).clientY;

        const computedStyle = getComputedStyle(this.target);

        const canScrollX = computedStyle.overflowX === "scroll" || computedStyle.overflowX === "auto",
            canScrollY = computedStyle.overflowY === "scroll" || computedStyle.overflowY === "auto";

        if (!canScrollX && !canScrollY) return;

        const cursorPos = new DOMPoint(clientX, clientY);
        const clientRect = <DOMRect>this.target.getBoundingClientRect();

        const topScrollRegion = DOMUtils.clipRectSide(clientRect, "top", SCROLL_REGION_OFFSET),
            rightScrollRegion = DOMUtils.clipRectSide(clientRect, "right", SCROLL_REGION_OFFSET),
            bottomScrollRegion = DOMUtils.clipRectSide(clientRect, "bottom", SCROLL_REGION_OFFSET),
            leftScrollRegion = DOMUtils.clipRectSide(clientRect, "left", SCROLL_REGION_OFFSET);

        const isCursorInTopScrollRegion = DOMUtils.pointInRect(topScrollRegion, cursorPos),
            isCursorInRightScrollRegion = DOMUtils.pointInRect(rightScrollRegion, cursorPos),
            isCursorInBottomScrollRegion = DOMUtils.pointInRect(bottomScrollRegion, cursorPos),
            isCursorInLeftScrollRegion = DOMUtils.pointInRect(leftScrollRegion, cursorPos);

        switch (this.__stateX) {
            case AutoScrollerState.Ready: //Horizontal scroll is ready
                if (canScrollX) { //Horizontal scroll is possible, check if cursor is inside any of the 
                    //horizontal scrolling zones
                    if (isCursorInRightScrollRegion) //Cursor is inside the right zone, request 
                        //scrolling right
                        this.__doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Horizontal,
                            direction: AutoScrollerDirection.Forward
                        });
                    else if (isCursorInLeftScrollRegion) //Cursor is inside the left zone, request
                        //scrolling left
                        this.__doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Horizontal,
                            direction: AutoScrollerDirection.Backward
                        });
                }
                break;

            case AutoScrollerState.ScrollActive: //Horizontal scroll is active
                if (isCursorInRightScrollRegion && this.__directionX === AutoScrollerDirection.Forward && canScrollX)
                    //Cursor remains in the right scroll region and horizontal scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: AutoScrollerOrientation.Horizontal,
                        rate: cursorPos.x - rightScrollRegion.left
                    });
                else if (isCursorInLeftScrollRegion && this.__directionX === AutoScrollerDirection.Backward && canScrollX)
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

        switch (this.__stateY) {
            case AutoScrollerState.Ready: //Vertical scroll is ready
                if (canScrollY) { //Vertical scroll is possible, check if cursor is inside any of the 
                    //vertical scrolling zones
                    if (isCursorInTopScrollRegion) //Cursor is inside the top zone, request scrolling up
                        this.__doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Vertical,
                            direction: AutoScrollerDirection.Backward
                        });
                    else if (isCursorInBottomScrollRegion) //Cursor is inside the bottom zone. Request 
                        //scrolling down
                        this.__doRequestScrollStart({
                            orientation: AutoScrollerOrientation.Vertical,
                            direction: AutoScrollerDirection.Forward
                        });
                }
                break;

            case AutoScrollerState.ScrollActive: //Vertical scroll is acrive
                if (isCursorInTopScrollRegion && this.__directionY === AutoScrollerDirection.Backward && canScrollY)
                    //Cursor remains in the top scroll region and vertical scroll is still possible, 
                    //carry on and update scrolling rate
                    this.__doScrollRateChange({
                        orientation: AutoScrollerOrientation.Vertical,
                        rate: topScrollRegion.bottom - cursorPos.y
                    });
                else if (isCursorInBottomScrollRegion && this.__directionY === AutoScrollerDirection.Forward && canScrollY)
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

    private __target_onMouseLeave(evt: Event) {
        if (this.__stateY == AutoScrollerState.ScrollActive)
            this.__doScrollEnd({
                orientation: AutoScrollerOrientation.Vertical
            });

        if (this.__stateX == AutoScrollerState.ScrollActive)
            this.__doScrollEnd({
                orientation: AutoScrollerOrientation.Horizontal
            });
    }

    get ScrollRequestStartEvent(): FrameworkEvent { return this.__ScrollRequestStartEvent; }
    private __ScrollRequestStartEvent: FrameworkEvent = new FrameworkEvent();

    get ScrollStartEvent(): FrameworkEvent { return this.__ScrollStartEvent; }
    private __ScrollStartEvent: FrameworkEvent = new FrameworkEvent();

    get ScrollRateChangeEvent(): FrameworkEvent { return this.__ScrollRateChangeEvent; }
    private __ScrollRateChangeEvent: FrameworkEvent = new FrameworkEvent();

    get ScrollEndEvent(): FrameworkEvent { return this.__ScrollEndEvent; }
    private __ScrollEndEvent: FrameworkEvent = new FrameworkEvent();

    get target(): Element { return this.__target; }
    private __target: Element;

    private __scrollTimer: Timer = new Timer(10, true);

    private __rateX: number = 0;
    private __rateY: number = 0;

    private __stateX: number = AutoScrollerState.Ready;
    private __stateY: number = AutoScrollerState.Ready;

    private __directionX: number = AutoScrollerDirection.None;
    private __directionY: number = AutoScrollerDirection.None;
}