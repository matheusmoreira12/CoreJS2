import { InvalidOperationException } from "../../Standard/index";
import { PropertyAttributeBinding } from "../Bindings/index";
import { DragDropHandler } from "../index";
import { FrameworkEvent, NativeEvent, FrameworkEventArgs, NativeEventArgs } from "../../Standard/Events/index";
import { BooleanAttributeValueConverter } from "../ValueConverters/index";
import { DependencyProperty, DependencyPropertyOptions } from "../DependencyObjects/index";
import { Type } from "../../Standard/Types/Type";
import { VisualTreeElement } from "../VisualTrees/index";

///TODO: fix this mess

export abstract class Control extends VisualTreeElement {
    constructor(domElement: Element) {
        super(domElement);

        if (new.target === Control)
            throw new InvalidOperationException("Invalid constructor");

        //Create Bindings
        new PropertyAttributeBinding(this, Control.isDraggableProperty, <Element>this.__domNode, "draggable", {
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
    private __dragDropHandler = new DragDropHandler(<Element>this.__domNode);

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
    private __onMouseEnter(sender: any, args: NativeEventArgs) {
        this.isMouseOver = true;
    }
    MouseEnterEvent = new NativeEvent(this.__domNode, "mouseenter", this.__onMouseEnter, this);

    //      Mouse Leave Event
    private __onMouseLeave(sender: any, args: NativeEventArgs) {
        this.isMouseOver = false;
    }
    MouseLeaveEvent = new NativeEvent(this.__domNode, "mouseleave", this.__onMouseLeave, this);

    //      Mouse Down Event
    private __onMouseDown(sender: any, args: NativeEventArgs) {
        this.isMouseDown = true;
    }
    MouseDownEvent = new NativeEvent(this.__domNode, "mousedown", this.__onMouseDown, this);

    //      Mouse Up Event
    private __onMouseUp(sender: any, args: NativeEventArgs) { 
        this.isMouseDown = false;
    }
    MouseUpEvent = new NativeEvent(this.__domNode, "mouseup", this.__onMouseUp, this);

    //      Mouse Move Event
    private __onMouseMove(sender: any, args: NativeEventArgs) { 

    }
    MouseMoveEvent = new NativeEvent(this.__domNode, "mousemove", this.__onMouseMove, this);

    //      Click Event
    private __onClick(sender: any, args: NativeEventArgs) { 

    }
    ClickEvent = new NativeEvent(this.__domNode, "click", this.__onClick, this);

    //Framework Properties
    //State Properties
    //Mouse State Properties
    //Is Mouse Over Property
    static isMouseOverProperty = new DependencyProperty("isMouseOver", new DependencyPropertyOptions(Type.get(Boolean), false));
    get isMouseOver() { return Control.isMouseOverProperty.get(this); }
    set isMouseOver(value) { Control.isMouseOverProperty.set(this, value); }

    //Is Mouse Down Property
    static isMouseDownProperty = new DependencyProperty("isMouseDown", new DependencyPropertyOptions(Type.get(Boolean), false));
    get isMouseDown() { return Control.isMouseDownProperty.get(this); }
    set isMouseDown(value) { Control.isMouseDownProperty.set(this, value); }

    //Drag State Properties
    //Is Dragging Property
    static isDraggingProperty = new DependencyProperty("isDragging", new DependencyPropertyOptions(Type.get(Boolean), false));
    get isDragging() { return Control.isDraggingProperty.get(this); }
    set isDragging(value) { Control.isDraggingProperty.set(this, value); }

    //Is Drag Over Property
    static isDragOverProperty = new DependencyProperty("isDragOver", new DependencyPropertyOptions(Type.get(Boolean), false));
    get isDragOver() { return Control.isDragOverProperty.get(this); }
    set isDragOver(value) { Control.isDragOverProperty.set(this, value); }

    //Drag Properties
    static isDraggableProperty = new DependencyProperty("isDraggable", new DependencyPropertyOptions(Type.get(Boolean), false));
    get isDraggable() { return Control.isDraggableProperty.get(this); }
    set isDraggable(value) { Control.isDraggableProperty.set(this, value); }

    //Visual Properties
    //Background Property
    static backgroundProperty = new DependencyProperty("background", new DependencyPropertyOptions(null, null));
    get background() { return Control.backgroundProperty.get(this); }
    set background(value) { Control.backgroundProperty.set(this, value); }

    //Foreground Property
    static foregroundProperty = new DependencyProperty("foreground", new DependencyPropertyOptions(null, null));
    get foreground() { return Control.foregroundProperty.get(this); }
    set foreground(value) { Control.foregroundProperty.set(this, value); }
}