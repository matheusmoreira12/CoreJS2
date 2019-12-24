import { InvalidOperationException } from "../Standard/Exceptions";
import { PropertyAttributeBinding } from "./Bindings";
import { BooleanAttributeValueConverter, FrameworkProperty } from "./user-interface";
import DragDropHandler from "./DragDropHandler";
import { FrameworkEvent, NativeEvent } from "../Standard/Events";

export abstract class Widget extends HTMLElement {
    constructor() {
        super();

        if (new.target === Widget)
            throw new InvalidOperationException("Invalid constructor");

        //Create Bindings
        new PropertyAttributeBinding(this, Widget.isDraggableProperty, this, "draggable", { valueConverter: new BooleanAttributeValueConverter() });

        //Attach Event Handlers
        //  Drag/Drop Handler Events
        this.__dragDropHandler.RequestDragStartEvent.attach(this.__dragDropHandler__onRequestDragStart, this);
        this.__dragDropHandler.DragStartEvent.attach(this.__dragDropHandler__onDragStart, this);
        this.__dragDropHandler.DragMoveEvent.attach(this.__dragDropHandler__onDragMove, this);
        this.__dragDropHandler.DragEndEvent.attach(this.__dragDropHandler__onDragEnd, this);
        this.__dragDropHandler.DragCancelEvent.attach(this.__dragDropHandler__onDragCancel, this);
        this.__dragDropHandler.DragEnterEvent.attach(this.__dragDropHandler__onDragEnter, this);
        this.__dragDropHandler.DragOverEvent.attach(this.__dragDropHandler__onDragOver, this);
        this.__dragDropHandler.DragLeaveEvent.attach(this.__dragDropHandler__onDragLeave, this);
        this.__dragDropHandler.DragDropEvent.attach(this.__dragDropHandler__onDragDrop, this);
    }

    //Helper Class Instances
    private __dragDropHandler = new DragDropHandler(this);

    protected connectedCallback() {
    }

    protected disconnectedCallback() {
    }

    //Drag/Drop Handler Event Listeners
    private __dragDropHandler__onRequestDragStart(sender, args) {
        let { acceptDrag } = args;

        if (this.isDraggable)
            acceptDrag();
    }

    private __dragDropHandler__onDragStart(sender, args) {
        this.DragStartEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragMove(sender, args) {
        this.DragMoveEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragEnd(sender, args) {
        this.DragEndEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragCancel(sender, args) {
        this.DragCancelEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragEnter(sender, args) {
        this.DragEnterEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragOver(sender, args) {
        this.DragOverEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragLeave(sender, args) {
        this.DragLeaveEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragDrop(sender, args) {
        this.DragDropEvent.invoke(this, args);
    }

    //Framework Events
    //  Drag/Drop Events
    private __onDragMove(sender, args) { }
    DragStartEvent = new FrameworkEvent(this.__onDragStart.bind(this));

    private __onDragStart(sender, args) {
        this.isDragging = true;
    }
    DragMoveEvent = new FrameworkEvent(this.__onDragMove.bind(this));

    private __onDragEnd(sender, args) {
        this.isDragging = false;
    }
    DragEndEvent = new FrameworkEvent(this.__onDragEnd.bind(this));

    private __onDragCancel(sender, args) {
        this.isDragging = false;
    }
    DragCancelEvent = new FrameworkEvent(this.__onDragCancel.bind(this));

    private __onDragEnter(sender, args) { }
    DragEnterEvent = new FrameworkEvent(this.__onDragEnter.bind(this));

    private __onDragOver(sender, args) {
        this.isDragOver = true;
    }
    DragOverEvent = new FrameworkEvent(this.__onDragOver.bind(this));

    private __onDragLeave(sender, args) {
        this.isDragOver = false;
    }
    DragLeaveEvent = new FrameworkEvent(this.__onDragLeave.bind(this));

    private __onDragDrop(sender, args) {
        this.isDragOver = false;
    }
    DragDropEvent = new FrameworkEvent(this.__onDragDrop.bind(this));

    //  Mouse Events
    //      Mouse Enter Event
    private __onMouseEnter(sender, args) {
        this.isMouseOver = true;
    }
    MouseEnterEvent = new NativeEvent(this, "mouseenter", this.__onMouseEnter.bind(this));

    //      Mouse Leave Event
    private __onMouseLeave(sender, args) {
        this.isMouseOver = false;
    }
    MouseLeaveEvent = new NativeEvent(this, "mouseleave", this.__onMouseLeave.bind(this));

    //      Mouse Down Event
    private __onMouseDown(sender, args) { }
    MouseDownEvent = new NativeEvent(this, "mousedown", this.__onMouseDown.bind(this));

    //      Mouse Move Event
    private __onMouseMove(sender, args) { }
    MouseMoveEvent = new NativeEvent(this, "mousemove", this.__onMouseMove.bind(this));

    //      Mouse Up Event
    private __onMouseUp(sender, args) { }
    MouseUpEvent = new NativeEvent(this, "mouseup", this.__onMouseUp.bind(this));

    //      Click Event
    private __onClick(sender, args) { }
    ClickEvent = new NativeEvent(this, "click", this.__onClick.bind(this));

    //Framework Properties
    //  State Properties
    //      Mouse State Properties
    //          Is Mouse Over Property
    static isMouseOverProperty = new FrameworkProperty("isMouseOver", { defaultValue: false });
    get isMouseOver() { return Widget.isMouseOverProperty.get(this); }
    set isMouseOver(value) { Widget.isMouseOverProperty.set(this, value); }

    //      Drag State Properties
    //          Is Dragging Property
    static isDraggingProperty = new FrameworkProperty("isDragging", { defaultValue: false });
    get isDragging() { return Widget.isDraggingProperty.get(this); }
    set isDragging(value) { Widget.isDraggingProperty.set(this, value); }

    //          Is Drag Over Property
    static isDragOverProperty = new FrameworkProperty("isDragOver", { defaultValue: false });
    get isDragOver() { return Widget.isDragOverProperty.get(this); }
    set isDragOver(value) { Widget.isDragOverProperty.set(this, value); }

    //  Drag Properties
    static isDraggableProperty = new FrameworkProperty("isDraggable", { defaultValue: false });
    get isDraggable() { return Widget.isDraggableProperty.get(this); }
    set isDraggable(value) { Widget.isDraggableProperty.set(this, value); }
}