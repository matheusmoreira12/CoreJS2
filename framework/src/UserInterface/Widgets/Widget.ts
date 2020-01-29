import { Destructible, InvalidOperationException } from "../../Standard/index";
import { PropertyAttributeBinding } from "../Bindings/index";
import { DragDropHandler } from "../index";
import { FrameworkEvent, NativeEvent, FrameworkEventArgs } from "../../Standard/Events/index";
import { BooleanAttributeValueConverter } from "../ValueConverters/index";
import { FrameworkProperty, FrameworkPropertyOptions } from "../DependencyObjects/index";
import { VisualTreeNode, VisualTreeElement } from "../VisualTreeManagement";
import { Type } from "../../Standard/Types/Type";

///TODO: fix this mess

export abstract class Widget extends VisualTreeElement {
    constructor(domElement: Element) {
        super(domElement);

        if (new.target === Widget)
            throw new InvalidOperationException("Invalid constructor");

        //Create Bindings
        new PropertyAttributeBinding(this, Widget.isDraggableProperty, <Element>this.__domNode, "draggable", {
            get valueConverter() { return new BooleanAttributeValueConverter(); }
        });

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
    private __dragDropHandler = new DragDropHandler(<Element>this.domNode);

    //Drag/Drop Handler Event Listeners
    private __dragDropHandler__onRequestDragStart(sender: any, args: FrameworkEventArgs) {
        if (this.isDraggable)
            args.acceptDrag();
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
    DragStartEvent = new FrameworkEvent(this.__onDragStart, this);

    private __onDragStart(sender: any, args: FrameworkEventArgs) {
        this.isDragging = true;
    }
    DragMoveEvent = new FrameworkEvent(this.__onDragMove, this);

    private __onDragEnd(sender: any, args: FrameworkEventArgs) {
        this.isDragging = false;
    }
    DragEndEvent = new FrameworkEvent(this.__onDragEnd, this);

    private __onDragCancel(sender: any, args: FrameworkEventArgs) {
        this.isDragging = false;
    }
    DragCancelEvent = new FrameworkEvent(this.__onDragCancel, this);

    private __onDragEnter(sender: any, args: FrameworkEventArgs) { }
    DragEnterEvent = new FrameworkEvent(this.__onDragEnter, this);

    private __onDragOver(sender: any, args: FrameworkEventArgs) {
        this.isDragOver = true;
    }
    DragOverEvent = new FrameworkEvent(this.__onDragOver, this);

    private __onDragLeave(sender: any, args: FrameworkEventArgs) {
        this.isDragOver = false;
    }
    DragLeaveEvent = new FrameworkEvent(this.__onDragLeave, this);

    private __onDragDrop(sender: any, args: FrameworkEventArgs) {
        this.isDragOver = false;
    }
    DragDropEvent = new FrameworkEvent(this.__onDragDrop, this);

    //  Mouse Events
    //      Mouse Enter Event
    private __onMouseEnter(sender: any, args: FrameworkEventArgs) {
        this.isMouseOver = true;
    }
    MouseEnterEvent = new NativeEvent(this.__domNode, "mouseenter", this.__onMouseEnter, this);

    //      Mouse Leave Event
    private __onMouseLeave(sender: any, args: FrameworkEventArgs) {
        this.isMouseOver = false;
    }
    MouseLeaveEvent = new NativeEvent(this.__domNode, "mouseleave", this.__onMouseLeave, this);

    //      Mouse Down Event
    private __onMouseDown(sender: any, args: FrameworkEventArgs) { }
    MouseDownEvent = new NativeEvent(this.__domNode, "mousedown", this.__onMouseDown, this);

    //      Mouse Move Event
    private __onMouseMove(sender: any, args: FrameworkEventArgs) { }
    MouseMoveEvent = new NativeEvent(this.__domNode, "mousemove", this.__onMouseMove, this);

    //      Mouse Up Event
    private __onMouseUp(sender: any, args: FrameworkEventArgs) { }
    MouseUpEvent = new NativeEvent(this.__domNode, "mouseup", this.__onMouseUp, this);

    //      Click Event
    private __onClick(sender: any, args: FrameworkEventArgs) { }
    ClickEvent = new NativeEvent(this.__domNode, "click", this.__onClick, this);

    //Framework Properties
    //  State Properties
    //      Mouse State Properties
    //          Is Mouse Over Property
    static isMouseOverProperty = new FrameworkProperty("isMouseOver", new FrameworkPropertyOptions(Type.get(Boolean), false));
    get isMouseOver() { return Widget.isMouseOverProperty.get(this); }
    set isMouseOver(value) { Widget.isMouseOverProperty.set(this, value); }

    //      Drag State Properties
    //          Is Dragging Property
    static isDraggingProperty = new FrameworkProperty("isDragging", new FrameworkPropertyOptions(Type.get(Boolean), false));
    get isDragging() { return Widget.isDraggingProperty.get(this); }
    set isDragging(value) { Widget.isDraggingProperty.set(this, value); }

    //          Is Drag Over Property
    static isDragOverProperty = new FrameworkProperty("isDragOver", new FrameworkPropertyOptions(Type.get(Boolean), false));
    get isDragOver() { return Widget.isDragOverProperty.get(this); }
    set isDragOver(value) { Widget.isDragOverProperty.set(this, value); }

    //  Drag Properties
    static isDraggableProperty = new FrameworkProperty("isDraggable", new FrameworkPropertyOptions(Type.get(Boolean), false));
    get isDraggable() { return Widget.isDraggableProperty.get(this); }
    set isDraggable(value) { Widget.isDraggableProperty.set(this, value); }

    get shadowRoot(): VisualTreeNode { return this.__shadowRoot; }
    private __shadowRoot: VisualTreeNode;
}