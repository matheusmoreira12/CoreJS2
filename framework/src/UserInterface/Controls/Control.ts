import { InvalidOperationException } from "../../Standard/index";
import { PropertyAttributeBinding } from "../Bindings/index";
import { DragDropHandler } from "../index";
import { FrameworkEvent, NativeEvent, FrameworkEventArgs, NativeEventArgs } from "../../Standard/Events/index";
import { BooleanAttributeValueConverter } from "../ValueConverters/index";
import { DependencyProperty } from "../DependencyObjects/index";
import { Type } from "../../Standard/Types/Type";
import { VisualTreeElement } from "../VisualTrees/index";

///TODO: fix this mess

export abstract class Control extends VisualTreeElement {
    constructor(domElement: Element) {
        super(domElement);

        if (new.target === Control)
            throw new InvalidOperationException("Invalid constructor");

        //Create Bindings
        new PropertyAttributeBinding(this.DependencyObject, Control.isDraggableProperty, <Element>this.__domNode, "core:draggable", "core", {
            valueConverter: new BooleanAttributeValueConverter()
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
    private __dragDropHandler__onRequestDragStart(args: FrameworkEventArgs) {
        if (this.isDraggable)
            args.acceptDrag();
    }

    private __dragDropHandler__onDragStart(args: FrameworkEventArgs) {
        this.DragStartEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragMove(args: FrameworkEventArgs) {
        this.DragMoveEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragEnd(args: FrameworkEventArgs) {
        this.DragEndEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragCancel(args: FrameworkEventArgs) {
        this.DragCancelEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragEnter(args: FrameworkEventArgs) {
        this.DragEnterEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragOver(args: FrameworkEventArgs) {
        this.DragOverEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragLeave(args: FrameworkEventArgs) {
        this.DragLeaveEvent.invoke(this, args);
    }

    private __dragDropHandler__onDragDrop(args: FrameworkEventArgs) {
        this.DragDropEvent.invoke(this, args);
    }

    //Framework Events
    //Drag/Drop Events
    private __onDragMove() { }
    DragStartEvent = new FrameworkEvent(this.__onDragStart, this);

    private __onDragStart() {
        this.isDragging = true;
    }
    DragMoveEvent = new FrameworkEvent(this.__onDragMove, this);

    private __onDragEnd() {
        this.isDragging = false;
    }
    DragEndEvent = new FrameworkEvent(this.__onDragEnd, this);

    private __onDragCancel() {
        this.isDragging = false;
    }
    DragCancelEvent = new FrameworkEvent(this.__onDragCancel, this);

    private __onDragEnter() { }
    DragEnterEvent = new FrameworkEvent(this.__onDragEnter, this);

    private __onDragOver() {
        this.isDragOver = true;
    }
    DragOverEvent = new FrameworkEvent(this.__onDragOver, this);

    private __onDragLeave() {
        this.isDragOver = false;
    }
    DragLeaveEvent = new FrameworkEvent(this.__onDragLeave, this);

    private __onDragDrop() {
        this.isDragOver = false;
    }
    DragDropEvent = new FrameworkEvent(this.__onDragDrop, this);

    //Mouse Events
    //Mouse Enter Event
    private __onMouseEnter() {
        this.isMouseOver = true;
    }
    MouseEnterEvent = new NativeEvent(this.__domNode, "mouseenter", this.__onMouseEnter, this);

    //Mouse Leave Event
    private __onMouseLeave() {
        this.isMouseOver = false;
    }
    MouseLeaveEvent = new NativeEvent(this.__domNode, "mouseleave", this.__onMouseLeave, this);

    //Mouse Down Event
    private __onMouseDown() {
        this.isMouseDown = true;
    }
    MouseDownEvent = new NativeEvent(this.__domNode, "mousedown", this.__onMouseDown, this);

    //Mouse Up Event
    private __onMouseUp() {
        this.isMouseDown = false;
    }
    MouseUpEvent = new NativeEvent(this.__domNode, "mouseup", this.__onMouseUp, this);

    //Mouse Move Event
    private __onMouseMove() {

    }
    MouseMoveEvent = new NativeEvent(this.__domNode, "mousemove", this.__onMouseMove, this);

    //Click Event
    private __onClick() {

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

    protected destructor() {
        super.destructor();
    }
}