import { InvalidOperationException } from "../Standard/Exceptions";
import { PropertyAttributeBinding } from "./Bindings";
import { BooleanAttributeValueConverter, FrameworkProperty } from "./user-interface";
import DragDropHandler from "./DragDropHandler";
import { FrameworkEvent, NativeEvent } from "../Standard/Events";
export class Widget extends HTMLElement {
    constructor() {
        super();
        //Helper Class Instances
        this.__dragDropHandler = new DragDropHandler(this);
        this.DragStartEvent = new FrameworkEvent(this.__onDragStart.bind(this));
        this.DragMoveEvent = new FrameworkEvent(this.__onDragMove.bind(this));
        this.DragEndEvent = new FrameworkEvent(this.__onDragEnd.bind(this));
        this.DragCancelEvent = new FrameworkEvent(this.__onDragCancel.bind(this));
        this.DragEnterEvent = new FrameworkEvent(this.__onDragEnter.bind(this));
        this.DragOverEvent = new FrameworkEvent(this.__onDragOver.bind(this));
        this.DragLeaveEvent = new FrameworkEvent(this.__onDragLeave.bind(this));
        this.DragDropEvent = new FrameworkEvent(this.__onDragDrop.bind(this));
        this.MouseEnterEvent = new NativeEvent(this, "mouseenter", this.__onMouseEnter.bind(this));
        this.MouseLeaveEvent = new NativeEvent(this, "mouseleave", this.__onMouseLeave.bind(this));
        this.MouseDownEvent = new NativeEvent(this, "mousedown", this.__onMouseDown.bind(this));
        this.MouseMoveEvent = new NativeEvent(this, "mousemove", this.__onMouseMove.bind(this));
        this.MouseUpEvent = new NativeEvent(this, "mouseup", this.__onMouseUp.bind(this));
        this.ClickEvent = new NativeEvent(this, "click", this.__onClick.bind(this));
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
    connectedCallback() {
    }
    disconnectedCallback() {
    }
    //Drag/Drop Handler Event Listeners
    __dragDropHandler__onRequestDragStart(sender, args) {
        let { acceptDrag } = args;
        if (this.isDraggable)
            acceptDrag();
    }
    __dragDropHandler__onDragStart(sender, args) {
        this.DragStartEvent.invoke(this, args);
    }
    __dragDropHandler__onDragMove(sender, args) {
        this.DragMoveEvent.invoke(this, args);
    }
    __dragDropHandler__onDragEnd(sender, args) {
        this.DragEndEvent.invoke(this, args);
    }
    __dragDropHandler__onDragCancel(sender, args) {
        this.DragCancelEvent.invoke(this, args);
    }
    __dragDropHandler__onDragEnter(sender, args) {
        this.DragEnterEvent.invoke(this, args);
    }
    __dragDropHandler__onDragOver(sender, args) {
        this.DragOverEvent.invoke(this, args);
    }
    __dragDropHandler__onDragLeave(sender, args) {
        this.DragLeaveEvent.invoke(this, args);
    }
    __dragDropHandler__onDragDrop(sender, args) {
        this.DragDropEvent.invoke(this, args);
    }
    //Framework Events
    //  Drag/Drop Events
    __onDragMove(sender, args) { }
    __onDragStart(sender, args) {
        this.isDragging = true;
    }
    __onDragEnd(sender, args) {
        this.isDragging = false;
    }
    __onDragCancel(sender, args) {
        this.isDragging = false;
    }
    __onDragEnter(sender, args) { }
    __onDragOver(sender, args) {
        this.isDragOver = true;
    }
    __onDragLeave(sender, args) {
        this.isDragOver = false;
    }
    __onDragDrop(sender, args) {
        this.isDragOver = false;
    }
    //  Mouse Events
    //      Mouse Enter Event
    __onMouseEnter(sender, args) {
        this.isMouseOver = true;
    }
    //      Mouse Leave Event
    __onMouseLeave(sender, args) {
        this.isMouseOver = false;
    }
    //      Mouse Down Event
    __onMouseDown(sender, args) { }
    //      Mouse Move Event
    __onMouseMove(sender, args) { }
    //      Mouse Up Event
    __onMouseUp(sender, args) { }
    //      Click Event
    __onClick(sender, args) { }
    get isMouseOver() { return Widget.isMouseOverProperty.get(this); }
    set isMouseOver(value) { Widget.isMouseOverProperty.set(this, value); }
    get isDragging() { return Widget.isDraggingProperty.get(this); }
    set isDragging(value) { Widget.isDraggingProperty.set(this, value); }
    get isDragOver() { return Widget.isDragOverProperty.get(this); }
    set isDragOver(value) { Widget.isDragOverProperty.set(this, value); }
    get isDraggable() { return Widget.isDraggableProperty.get(this); }
    set isDraggable(value) { Widget.isDraggableProperty.set(this, value); }
}
//Framework Properties
//  State Properties
//      Mouse State Properties
//          Is Mouse Over Property
Widget.isMouseOverProperty = new FrameworkProperty("isMouseOver", { defaultValue: false });
//      Drag State Properties
//          Is Dragging Property
Widget.isDraggingProperty = new FrameworkProperty("isDragging", { defaultValue: false });
//          Is Drag Over Property
Widget.isDragOverProperty = new FrameworkProperty("isDragOver", { defaultValue: false });
//  Drag Properties
Widget.isDraggableProperty = new FrameworkProperty("isDraggable", { defaultValue: false });
