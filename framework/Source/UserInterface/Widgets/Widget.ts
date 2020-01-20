import { Destructible } from "../../Standard/index.js";
import { PropertyAttributeBinding } from "../Bindings/index.js";
import { DragDropHandler } from "../index.js";
import { FrameworkEvent, NativeEvent, FrameworkEventArgs } from "../../Standard/Events/index.js";
import { BooleanAttributeValueConverter } from "../ValueConverters/index.js";
import { DependencyProperty } from "../DependencyObjects/index.js";

///TODO: fix this mess

export abstract class Widget extends Destructible {
    constructor(namespaceURI: string, qualifiedName: string) {
        super();

        let element = document.createElementNS(namespaceURI, qualifiedName);
        Object.setPrototypeOf(this, Object.getPrototypeOf(element))
        Object.setPrototypeOf(element, this);

        /*if (new.target === Widget)
            throw new InvalidOperationException("Invalid constructor");*/

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

    //Drag/Drop Handler Event Listeners
    private __dragDropHandler__onRequestDragStart(sender: any, args: FrameworkEventArgs) {
        let { acceptDrag } = args;

        if (this.isDraggable)
            acceptDrag();
    }

    private __dragDropHandler__onDragStart(sender: any, args: FrameworkEventArgs) {
        this.DragStartEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragMove(sender: any, args: FrameworkEventArgs) {
        this.DragMoveEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragEnd(sender: any, args: FrameworkEventArgs) {
        this.DragEndEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragCancel(sender: any, args: FrameworkEventArgs) {
        this.DragCancelEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragEnter(sender: any, args: FrameworkEventArgs) {
        this.DragEnterEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragOver(sender: any, args: FrameworkEventArgs) {
        this.DragOverEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragLeave(sender: any, args: FrameworkEventArgs) {
        this.DragLeaveEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragDrop(sender: any, args: FrameworkEventArgs) {
        this.DragDropEvent.invoke(this, args);
    }

    //Framework Events
    //  Drag/Drop Events
    private __onDragMove(sender: any, args: FrameworkEventArgs) { }
    DragStartEvent = new FrameworkEvent(this.__onDragStart.bind(this));

    private __onDragStart(sender: any, args: FrameworkEventArgs) {
        this.isDragging = true;
    }
    DragMoveEvent = new FrameworkEvent(this.__onDragMove.bind(this));

    private __onDragEnd(sender: any, args: FrameworkEventArgs) {
        this.isDragging = false;
    }
    DragEndEvent = new FrameworkEvent(this.__onDragEnd.bind(this));

    private __onDragCancel(sender: any, args: FrameworkEventArgs) {
        this.isDragging = false;
    }
    DragCancelEvent = new FrameworkEvent(this.__onDragCancel.bind(this));

    private __onDragEnter(sender: any, args: FrameworkEventArgs) { }
    DragEnterEvent = new FrameworkEvent(this.__onDragEnter.bind(this));

    private __onDragOver(sender: any, args: FrameworkEventArgs) {
        this.isDragOver = true;
    }
    DragOverEvent = new FrameworkEvent(this.__onDragOver.bind(this));

    private __onDragLeave(sender: any, args: FrameworkEventArgs) {
        this.isDragOver = false;
    }
    DragLeaveEvent = new FrameworkEvent(this.__onDragLeave.bind(this));

    private __onDragDrop(sender: any, args: FrameworkEventArgs) {
        this.isDragOver = false;
    }
    DragDropEvent = new FrameworkEvent(this.__onDragDrop.bind(this));

    //  Mouse Events
    //      Mouse Enter Event
    private __onMouseEnter(sender: any, args: FrameworkEventArgs) {
        this.isMouseOver = true;
    }
    MouseEnterEvent = new NativeEvent(<HTMLElement><unknown>this, "mouseenter", this.__onMouseEnter.bind(this));

    //      Mouse Leave Event
    private __onMouseLeave(sender: any, args: FrameworkEventArgs) {
        this.isMouseOver = false;
    }
    MouseLeaveEvent = new NativeEvent(<HTMLElement><unknown>this, "mouseleave", this.__onMouseLeave.bind(this));

    //      Mouse Down Event
    private __onMouseDown(sender: any, args: FrameworkEventArgs) { }
    MouseDownEvent = new NativeEvent(<HTMLElement><unknown>this, "mousedown", this.__onMouseDown.bind(this));

    //      Mouse Move Event
    private __onMouseMove(sender: any, args: FrameworkEventArgs) { }
    MouseMoveEvent = new NativeEvent(<HTMLElement><unknown>this, "mousemove", this.__onMouseMove.bind(this));

    //      Mouse Up Event
    private __onMouseUp(sender: any, args: FrameworkEventArgs) { }
    MouseUpEvent = new NativeEvent(<HTMLElement><unknown>this, "mouseup", this.__onMouseUp.bind(this));

    //      Click Event
    private __onClick(sender: any, args: FrameworkEventArgs) { }
    ClickEvent = new NativeEvent(<HTMLElement><unknown>this, "click", this.__onClick.bind(this));

    //Framework Properties
    //  State Properties
    //      Mouse State Properties
    //          Is Mouse Over Property
    static isMouseOverProperty = new DependencyProperty("isMouseOver", { defaultValue: false });
    get isMouseOver() { return Widget.isMouseOverProperty.get(this); }
    set isMouseOver(value) { Widget.isMouseOverProperty.set(this, value); }

    //      Drag State Properties
    //          Is Dragging Property
    static isDraggingProperty = new DependencyProperty("isDragging", { defaultValue: false });
    get isDragging() { return Widget.isDraggingProperty.get(this); }
    set isDragging(value) { Widget.isDraggingProperty.set(this, value); }

    //          Is Drag Over Property
    static isDragOverProperty = new DependencyProperty("isDragOver", { defaultValue: false });
    get isDragOver() { return Widget.isDragOverProperty.get(this); }
    set isDragOver(value) { Widget.isDragOverProperty.set(this, value); }

    //  Drag Properties
    static isDraggableProperty = new DependencyProperty("isDraggable", { defaultValue: false });
    get isDraggable() { return Widget.isDraggableProperty.get(this); }
    set isDraggable(value) { Widget.isDraggableProperty.set(this, value); }
}
