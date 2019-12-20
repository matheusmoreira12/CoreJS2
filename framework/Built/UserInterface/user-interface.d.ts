import { ContextSelectionFlags } from "../Standard/ContextSelectionFlags";
import { Enumeration } from "../Standard/Enumeration";
export declare class BooleanAttributeValueConverter {
    convertBack(value: any): boolean;
    convert(value: any): "" | "false";
}
export declare class JSONAttributeValueConverter {
    convertBack(value: any): any;
    convert(value: any): string;
}
export declare class FlagsAttributeValueConverter {
    convertBack(value: any): ContextSelectionFlags;
    convert(value: any): any;
}
export declare class EnumerationAttributeValueConverter<T> {
    constructor(enumeration: Enumeration<T>);
    convertBack(value: T): any;
    convert(value: T): string;
    private __enumeration;
}
export declare const IFrameworkPropertyOptions: any;
/**
 * FrameworkProperty class
 * Eases the integration between user-defined properties and framework features.
 */
export declare class FrameworkProperty {
    static getAllProperties(type: any): any;
    constructor(name: any, options: any);
    _storedValues: WeakMap<object, any>;
    get(target: any): any;
    set(target: any, value: any): void;
    ChangeEvent: any;
    readonly name: any;
    private __name;
    readonly options: any;
    private __options;
}
/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export declare class FrameworkAction {
    constructor();
    execute(): void;
    _ExecutedEvent: any;
    readonly ExecutedEvent: any;
}
/**
 *
 */
export declare class Setter {
}
/**
 * Trigger base class
 */
export declare class Trigger {
    constructor(...actions: any[]);
    readonly actions: any;
}
/**
 * PropertyTrigger class
 * Triggers a group of action when the specified property matches the specified value.
 */
export declare class PropertyTrigger extends Trigger {
    constructor(target: any, targetProperty: any, value: any, ...actions: any[]);
    _targetProperty_onChange(sender: any, args: any): void;
    readonly target: any;
    readonly targetProperty: any;
    readonly value: any;
}
/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export declare class EventTrigger {
    constructor(targetEvent: any);
    _targetEvent_handler(): void;
    readonly targetEvent: any;
}
/**
 * Visual State Manager
 *  Manages the interactions between user interface and logic.
 */
declare class VisualStateManager {
    constructor();
    serverTaskStartedEvent: any;
    serverTaskFinishedEvent: any;
    _onServerTaskStarted(): void;
    _onServerTaskFinished(): void;
}
export declare const visualStateManager: VisualStateManager;
/**
 *
 */
export declare const Utils: {
    selectAllText(elem: any): void;
    deselectAllText(): void;
    intersectRects(rect1: any, rect2: any): DOMRect;
    offsetRect(rect: any, offsetTop: any, offsetRight: any, offsetBottom: any, offsetLeft: any): DOMRect;
    clipRectSide(rect: any, side: any, amount: any): DOMRect;
    pointInRect(rect: any, point: any): boolean;
    rectsIntersect(rect1: any, rect2: any): any;
    getElementTree(elem: any): Generator<any, void, unknown>;
    elementIsScrollable(elem: any): boolean;
    getViewportElements(elems: any): Generator<any, void, unknown>;
    getElementsUnderCursor(elems: any, cursorPos: any): Generator<any, void, unknown>;
    getElementVisibleRect(elem: any): any;
};
/**
 *
 */
export declare class Timer {
    constructor(delayMillis?: number, isPeriodic?: boolean);
    start(): void;
    stop(): void;
    _TickEvent: any;
    readonly delayMillis: any;
    readonly isPeriodic: any;
    readonly TickEvent: any;
}
/**
 * AutoScroller Class
 * Enables automatic scrolling for the framework widgets.
 */
export declare const AutoScrollerOrientation: Enumeration<import("../Standard/Enumeration").EnumerationValue>;
export declare const AutoScrollerDirection: Enumeration<import("../Standard/Enumeration").EnumerationValue>;
export declare class AutoScroller {
    constructor(target: any);
    _doRequestScrollStart(args: any): void;
    _doScrollStart(args: any): void;
    _doScrollRateChange(args: any): void;
    _doScrollEnd(args: any): void;
    _scrollTimer_onTick(sender: any, args: any): void;
    _RequestScrollStartEvent: any;
    _ScrollStartEvent: any;
    _ScrollRateChangeEvent: any;
    _ScrollEndEvent: any;
    _scrollTimer: Timer;
    _rateX: number;
    _rateY: number;
    _stateX: any;
    _stateY: any;
    _directionX: any;
    _directionY: any;
    _window_onMouseMove(evt: any): void;
    _target_onMouseLeave(evt: any): void;
    readonly ScrollRequestStartEvent: any;
    readonly ScrollStartEvent: any;
    readonly ScrollRateChangeEvent: any;
    readonly ScrollEndEvent: any;
    readonly target: any;
}
/**
 *
 */
declare class DragEmulator {
    constructor(handler: any);
    createPreviewElem(args: any): void;
    repositionPreviewElem(args: any): void;
    removePreviewElement(): void;
    onDragStart(sender: any, args: any): void;
    onDragMove(sender: any, args: any): void;
    onDragEnd(sender: any, args: any): void;
    onDragCancel(sender: any, args: any): void;
    DragStartEvent: any;
    DragMoveEvent: any;
    DragEndEvent: any;
    DragCancelEvent: any;
    previewElem: any;
}
export declare class DragDropHandler {
    constructor(target: any);
    _onTouchStart(evt: any): void;
    _onTouchMove(evt: any): void;
    _onTouchEnd(evt: any): void;
    _onTouchCancel(evt: any): void;
    _target_onMouseDown(evt: any): void;
    _window_onMouseUp(evt: any): void;
    _window_onMouseMove(evt: any): void;
    _touchDragDelayTimer_onTick(sender: any, args: any): void;
    _doRequestDragStart(): void;
    _doDragStart(args: any): void;
    _doDragMove(args: any): void;
    _doDragEnd(args: any): void;
    _doDragCancel(): void;
    _doDragEnter(args: any): void;
    _doDragOver(args: any): void;
    _doDragLeave(args: any): void;
    _doDragDrop(args: any): void;
    _onNotifyDragMove(sender: any, args: any): void;
    _onNotifyDragEnd(sender: any, args: any): void;
    _NotifyDragStartEvent: any;
    _NotifyDragMoveEvent: any;
    _NotifyDragEndEvent: any;
    _NotifyDragCancelEvent: any;
    _RequestDragStartEvent: any;
    _DragStartEvent: any;
    _DragMoveEvent: any;
    _DragEndEvent: any;
    _DragCancelEvent: any;
    _DragEnterEvent: any;
    _DragOverEvent: any;
    _DragLeaveEvent: any;
    _DragDropEvent: any;
    _emulator: DragEmulator;
    _data: any;
    _context: any;
    _state: any;
    readonly RequestDragStartEvent: any;
    readonly DragStartEvent: any;
    readonly DragMoveEvent: any;
    readonly DragEndEvent: any;
    readonly DragCancelEvent: any;
    readonly DragEnterEvent: any;
    readonly DragOverEvent: any;
    readonly DragLeaveEvent: any;
    readonly DragDropEvent: any;
    readonly target: any;
}
export {};
