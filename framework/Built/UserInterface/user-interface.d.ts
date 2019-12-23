import { ContextSelectionFlags } from "../Standard/ContextSelectionFlags";
import { Enumeration } from "../Standard/Enumeration";
import { ValueConverter } from "../Standard/Standard";
import { Interface } from "../Standard/Interfaces/Interface";
import { FrameworkEvent, BroadcastFrameworkEvent } from "../Standard/Events";
import { Collection, Dictionary } from "../Standard/Collections";
export declare class BooleanAttributeValueConverter implements ValueConverter {
    convertBack(value: any): boolean;
    convert(value: any): string;
}
export declare class JSONAttributeValueConverter implements ValueConverter {
    convertBack(value: any): JSON;
    convert(value: any): string;
}
export declare class FlagsAttributeValueConverter implements ValueConverter {
    convertBack(value: string): ContextSelectionFlags;
    convert(value: any): string;
}
export declare class EnumerationAttributeValueConverter<T> implements ValueConverter {
    constructor(enumeration: Enumeration<T>);
    convertBack(value: string): T;
    convert(value: T): string;
    private __enumeration;
}
export declare const IFrameworkPropertyOptions: Interface;
export interface FrameworkPropertyOptions {
    defaultValue: any;
}
/**
 * FrameworkProperty class
 * Eases the integration between user-defined properties and framework features.
 */
export declare class FrameworkProperty {
    constructor(name: string, options: FrameworkPropertyOptions);
    get(target: any): any;
    set(target: any, value: any): void;
    ChangeEvent: FrameworkEvent;
    readonly name: string;
    private __name;
    readonly options: FrameworkPropertyOptions;
    private __options;
    private __storedValues;
}
/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export declare abstract class FrameworkAction {
    constructor();
    execute(data?: Dictionary<string, any>): void;
    readonly ExecutedEvent: FrameworkEvent;
    private __ExecutedEvent;
}
/**
 * Trigger base class
 */
export declare abstract class Trigger {
    constructor();
}
/**
 *
 */
export declare class Setter {
}
/**
 * PropertyTrigger class
 * Triggers a group of action when the specified property matches the specified value.
 */
export declare class PropertyTrigger extends Trigger {
    constructor(target: object, targetProperty: FrameworkProperty, value: any, ...actions: FrameworkAction[]);
    private __targetProperty_onChange;
    readonly target: object;
    private __target;
    readonly targetProperty: FrameworkProperty;
    private __targetProperty;
    readonly value: any;
    private __value;
    readonly setters: Collection<Setter>;
    private __setters;
}
/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export declare class EventTrigger extends Trigger {
    constructor(targetEvent: FrameworkEvent, ...actions: FrameworkAction[]);
    private __targetEvent_handler;
    protected __executeActions(data?: Dictionary<string, any>): void;
    readonly targetEvent: FrameworkEvent;
    private __targetEvent;
    readonly actions: Collection<FrameworkAction>;
    private __actions;
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
    readonly delayMillis: number;
    private __delayMillis;
    readonly isPeriodic: boolean;
    private __isPeriodic;
    readonly TickEvent: FrameworkEvent;
    private __TickEvent;
    private __timeoutHandle;
}
/**
 * AutoScroller Class
 * Enables automatic scrolling for the framework widgets.
 */
export declare const AutoScrollerOrientation: Enumeration<import("../Standard/Enumeration").EnumerationValue>;
export declare const AutoScrollerDirection: Enumeration<import("../Standard/Enumeration").EnumerationValue>;
export declare class AutoScroller {
    constructor(target: any);
    private __doRequestScrollStart;
    private __doScrollStart;
    private __doScrollRateChange;
    private __doScrollEnd;
    private __scrollTimer_onTick;
    private __window_onMouseMove;
    private __target_onMouseLeave;
    private __ScrollRequestStartEvent;
    private __ScrollStartEvent;
    private __ScrollRateChangeEvent;
    private __ScrollEndEvent;
    private __scrollTimer;
    private __rateX;
    private __rateY;
    private __stateX;
    private __stateY;
    private __directionX;
    private __directionY;
    readonly ScrollRequestStartEvent: FrameworkEvent;
    readonly ScrollStartEvent: FrameworkEvent;
    readonly ScrollRateChangeEvent: FrameworkEvent;
    readonly ScrollEndEvent: FrameworkEvent;
    readonly target: Element;
    private __target;
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
