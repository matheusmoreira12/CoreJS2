import { ValueConverter, ContextSelectionFlags } from "./standard.js";
import { FrameworkEvent, BroadcastFrameworkEvent } from "./Standard.Events.js";
import { Enumeration } from "./Standard.Enumeration.js";
export declare class BooleanAttributeValueConverter extends ValueConverter {
    convertBack(value: any): boolean;
    convert(value: any): "" | "false";
}
export declare class JSONAttributeValueConverter extends ValueConverter {
    convertBack(value: any): any;
    convert(value: any): string;
}
export declare class FlagsAttributeValueConverter extends ValueConverter {
    convertBack(value: any): ContextSelectionFlags;
    convert(value: any): any;
}
export declare class EnumerationAttributeValueConverter extends ValueConverter {
    constructor(enumeration: any);
    convertBack(value: any): any;
    convert(value: any): any;
}
export declare class FrameworkProperty {
    static getAllProperties(type: any): any;
    constructor(name: any, options: any);
    _storedValues: WeakMap<object, any>;
    get(target: any): any;
    set(target: any, value: any): void;
    ChangeEvent: FrameworkEvent;
    readonly name: any;
    readonly options: any;
}
/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export declare class FrameworkAction {
    constructor();
    execute(): void;
    _ExecutedEvent: FrameworkEvent;
    readonly ExecutedEvent: FrameworkEvent;
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
    serverTaskStartedEvent: BroadcastFrameworkEvent;
    serverTaskFinishedEvent: BroadcastFrameworkEvent;
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
    _TickEvent: FrameworkEvent;
    readonly delayMillis: any;
    readonly isPeriodic: any;
    readonly TickEvent: FrameworkEvent;
}
/**
 * AutoScroller Class
 * Enables automatic scrolling for the framework widgets.
 */
export declare const AutoScrollerOrientation: Enumeration;
export declare const AutoScrollerDirection: Enumeration;
export declare class AutoScroller {
    constructor(target: any);
    _doRequestScrollStart(args: any): void;
    _doScrollStart(args: any): void;
    _doScrollRateChange(args: any): void;
    _doScrollEnd(args: any): void;
    _scrollTimer_onTick(sender: any, args: any): void;
    _RequestScrollStartEvent: FrameworkEvent;
    _ScrollStartEvent: FrameworkEvent;
    _ScrollRateChangeEvent: FrameworkEvent;
    _ScrollEndEvent: FrameworkEvent;
    _scrollTimer: Timer;
    _rateX: number;
    _rateY: number;
    _stateX: any;
    _stateY: any;
    _directionX: any;
    _directionY: any;
    _window_onMouseMove(evt: any): void;
    _target_onMouseLeave(evt: any): void;
    readonly ScrollRequestStartEvent: FrameworkEvent;
    readonly ScrollStartEvent: FrameworkEvent;
    readonly ScrollRateChangeEvent: FrameworkEvent;
    readonly ScrollEndEvent: FrameworkEvent;
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
    DragStartEvent: FrameworkEvent;
    DragMoveEvent: FrameworkEvent;
    DragEndEvent: FrameworkEvent;
    DragCancelEvent: FrameworkEvent;
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
    _NotifyDragStartEvent: BroadcastFrameworkEvent;
    _NotifyDragMoveEvent: BroadcastFrameworkEvent;
    _NotifyDragEndEvent: BroadcastFrameworkEvent;
    _NotifyDragCancelEvent: BroadcastFrameworkEvent;
    _RequestDragStartEvent: FrameworkEvent;
    _DragStartEvent: FrameworkEvent;
    _DragMoveEvent: FrameworkEvent;
    _DragEndEvent: FrameworkEvent;
    _DragCancelEvent: FrameworkEvent;
    _DragEnterEvent: FrameworkEvent;
    _DragOverEvent: FrameworkEvent;
    _DragLeaveEvent: FrameworkEvent;
    _DragDropEvent: FrameworkEvent;
    _emulator: DragEmulator;
    _data: any;
    _context: any;
    _state: any;
    readonly RequestDragStartEvent: FrameworkEvent;
    readonly DragStartEvent: FrameworkEvent;
    readonly DragMoveEvent: FrameworkEvent;
    readonly DragEndEvent: FrameworkEvent;
    readonly DragCancelEvent: FrameworkEvent;
    readonly DragEnterEvent: FrameworkEvent;
    readonly DragOverEvent: FrameworkEvent;
    readonly DragLeaveEvent: FrameworkEvent;
    readonly DragDropEvent: FrameworkEvent;
    readonly target: any;
}
export {};
