import { Enumeration } from "../Standard/Enumeration";
import { FrameworkEvent } from "../Standard/Events";
export declare const AutoScrollerOrientation: Enumeration<import("../Standard/Enumeration").EnumerationValue>;
export declare const AutoScrollerDirection: Enumeration<import("../Standard/Enumeration").EnumerationValue>;
/**
 * AutoScroller Class
 * Enables automatic scrolling for the framework widgets.
 */
export declare class AutoScroller {
    constructor(target: any);
    private __doRequestScrollStart;
    private __doScrollStart;
    private __doScrollRateChange;
    private __doScrollEnd;
    private __scrollTimer_onTick;
    private __window_onMouseMove;
    private __target_onMouseLeave;
    get ScrollRequestStartEvent(): FrameworkEvent;
    private __ScrollRequestStartEvent;
    get ScrollStartEvent(): FrameworkEvent;
    private __ScrollStartEvent;
    get ScrollRateChangeEvent(): FrameworkEvent;
    private __ScrollRateChangeEvent;
    get ScrollEndEvent(): FrameworkEvent;
    private __ScrollEndEvent;
    get target(): Element;
    private __target;
    private __scrollTimer;
    private __rateX;
    private __rateY;
    private __stateX;
    private __stateY;
    private __directionX;
    private __directionY;
}
