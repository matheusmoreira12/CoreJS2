import { InvalidOperationException } from "../../Standard/index";
import { PropertyAttributeBinding } from "../Bindings/index";
import { DragDropHandler } from "../index";
import { FrameworkEvent, NativeEvent, FrameworkEventArgs, NativeEventArgs } from "../../Standard/Events/index";
import { BooleanAttributeValueConverter } from "../ValueConverters/index";
import { DependencyProperty, PropertyChangeEventArgs } from "../DependencyObjects/index";
import { Type } from "../../Standard/Types/Type";
import { VisualTreeElement } from "../VisualTrees/index";
import { DependencyObject } from "../DependencyObjects/DependencyObject";

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

        this.DependencyObject = new DependencyObject();
    }

    //DependencyObject
    DependencyObject_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {

    }

    DependencyObject: DependencyObject;

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
    //Drag/Drop Events
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

    //Mouse Events
    //Mouse Enter Event
    private __onMouseEnter(sender: any, args: NativeEventArgs) {
        this.isMouseOver = true;
    }
    MouseEnterEvent = new NativeEvent(this.__domNode, "mouseenter", this.__onMouseEnter, this);

    //Mouse Leave Event
    private __onMouseLeave(sender: any, args: NativeEventArgs) {
        this.isMouseOver = false;
    }
    MouseLeaveEvent = new NativeEvent(this.__domNode, "mouseleave", this.__onMouseLeave, this);

    //Mouse Down Event
    private __onMouseDown(sender: any, args: NativeEventArgs) {
        this.isMouseDown = true;
    }
    MouseDownEvent = new NativeEvent(this.__domNode, "mousedown", this.__onMouseDown, this);

    //Mouse Up Event
    private __onMouseUp(sender: any, args: NativeEventArgs) {
        this.isMouseDown = false;
    }
    MouseUpEvent = new NativeEvent(this.__domNode, "mouseup", this.__onMouseUp, this);

    //Mouse Move Event
    private __onMouseMove(sender: any, args: NativeEventArgs) {

    }
    MouseMoveEvent = new NativeEvent(this.__domNode, "mousemove", this.__onMouseMove, this);

    //Click Event
    private __onClick(sender: any, args: NativeEventArgs) {

    }
    ClickEvent = new NativeEvent(this.__domNode, "click", this.__onClick, this);

    //Framework Properties
    //State Properties
    //Mouse State Properties
    //Is Mouse Over Property
    static isMouseOverProperty = DependencyProperty.register(<any>Control, "isMouseOver", { valueType: Type.get(Boolean), defaultValue: false });
    get isMouseOver() { return this.DependencyObject.get(Control.isMouseOverProperty); }
    set isMouseOver(value) { this.DependencyObject.set(Control.isMouseOverProperty, value); }

    //Is Mouse Down Property
    static isMouseDownProperty = DependencyProperty.register(<any>Control, "isMouseDown", { valueType: Type.get(Boolean), defaultValue: false });
    get isMouseDown() { return this.DependencyObject.get(Control.isMouseDownProperty); }
    set isMouseDown(value) { this.DependencyObject.set(Control.isMouseDownProperty, value); }

    //Drag State Properties
    //Is Dragging Property
    static isDraggingProperty = DependencyProperty.register(<any>Control, "isDragging", { valueType: Type.get(Boolean), defaultValue: false });
    get isDragging() { return this.DependencyObject.get(Control.isDraggingProperty); }
    set isDragging(value) { this.DependencyObject.set(Control.isDraggingProperty, value); }

    //Is Drag Over Property
    static isDragOverProperty = DependencyProperty.register(<any>Control, "isDragOver", { valueType: Type.get(Boolean), defaultValue: false });
    get isDragOver() { return this.DependencyObject.get(Control.isDragOverProperty); }
    set isDragOver(value) { this.DependencyObject.set(Control.isDragOverProperty, value); }

    //Drag Properties
    static isDraggableProperty = DependencyProperty.register(<any>Control, "isDraggable", { valueType: Type.get(Boolean), defaultValue: false });
    get isDraggable() { return this.DependencyObject.get(Control.isDraggableProperty); }
    set isDraggable(value) { this.DependencyObject.set(Control.isDraggableProperty, value); }

    //Visual Properties
    //Background Property
    static backgroundProperty = DependencyProperty.register(<any>Control, "background", { valueType: Type.get(Boolean), defaultValue: false });
    get background() { return this.DependencyObject.get(Control.backgroundProperty); }
    set background(value) { this.DependencyObject.set(Control.backgroundProperty, value); }

    //Foreground Property
    static foregroundProperty = DependencyProperty.register(<any>Control, "foreground", { valueType: Type.get(Boolean), defaultValue: false });
    get foreground() { return this.DependencyObject.get(Control.foregroundProperty); }
    set foreground(value) { this.DependencyObject.set(Control.foregroundProperty, value); }

    protected destructor(){
        this.DependencyObject.PropertyChangeEvent.detach(this.DependencyObject_onPropertyChange, this);

        super.destructor();
    }
}