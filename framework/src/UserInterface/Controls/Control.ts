import { InvalidOperationException } from "../../Standard/Exceptions/index.js"
import { Enumeration } from "../../Standard/index.js";
import { DragDropHandler, DOMUtils } from "../index.js";
import { FrameworkEvent, NativeEvent, FrameworkEventArgs } from "../../Standard/Events/index.js";
import { DependencyProperty, DependencyObject } from "../DependencyObjects/index.js";
import { Type } from "../../Standard/Types/Type.js";
import { MarkupElement, ChildrenChangeEventArgs, AttributesChangeEventArgs, ChildrenChangeAction, AttributesChangeAction } from "../Markup/index.js";
import { Blender } from "../../Standard/Blender/Blender.js";
import { PropertyAttributeBinding, BindingDirection } from "../Bindings/index.js";
import { AutosizeMode } from "./AutosizeMode.js";
import { ControlStyle } from "./Styling/ControlStyle.js";
import { assertParams } from "../../ValidationStandalone/index.js";

///TODO: fix this mess

export abstract class Control extends MarkupElement {
    constructor(name: string) {
        super(name);

        if (new.target === Control)
            throw new InvalidOperationException("Invalid constructor");

        this.ChildrenChangeEvent.attach(this.__onChildrenChange, this);
        this.AttributesChangeEvent.attach(this.__onAttributesChange, this);
    }

    protected __onChildrenChange(_sender: any, args: ChildrenChangeEventArgs) {
        if (this.isInitialized) {
            if (Enumeration.contains(ChildrenChangeAction.Remove, args.action)) {
                for (let child of args.oldChildren) {
                    if (child instanceof Control && child.isInitialized)
                        this.domElement!.removeChild(child.domElement!)
                }
            }

            if (Enumeration.contains(ChildrenChangeAction.Add, args.action)) {
                for (let child of args.newChildren) {
                    if (child instanceof Control && child.isInitialized)
                        DOMUtils.insertElementAt(this.domElement!, args.newIndex, child.domElement!)
                }
            }
        }
    }

    protected __onAttributesChange(_sender: any, args: AttributesChangeEventArgs) {
        if (this.isInitialized) {
            if (Enumeration.contains(AttributesChangeAction.Remove, args.action)) {
                for (let attribute of args.oldAttributes)
                    this.domElement!.removeAttribute(attribute.name.name);
            }

            if (Enumeration.contains(AttributesChangeAction.Add, args.action)) {
                for (let attribute of args.newAttributes)
                    this.domElement!.setAttribute(attribute.name.name, attribute.value);
            }
        }
    }

    protected __initialization() {
        new PropertyAttributeBinding(Blender.get(DependencyObject, this), Control.isDraggableProperty, this.domElement!, "core-is-draggable", null, { direction: BindingDirection.ToTarget });

        //Native events
        this.MouseEnterEvent = new NativeEvent(<Element>this.domElement, "mouseenter", this.__onMouseEnter, this);
        this.MouseLeaveEvent = new NativeEvent(<Element>this.domElement, "mouseleave", this.__onMouseLeave, this);
        this.MouseDownEvent = new NativeEvent(<Element>this.domElement, "mousedown", this.__onMouseDown, this);
        this.MouseUpEvent = new NativeEvent(<Element>this.domElement, "mouseup", this.__onMouseUp, this);
        this.MouseMoveEvent = new NativeEvent(<Element>this.domElement, "mousemove", this.__onMouseMove, this);
        this.ClickEvent = new NativeEvent(<Element>this.domElement, "click", this.__onClick, this);

        //Drag/drop handler and events
        const dragDropHandler = new DragDropHandler(<Element>this.domElement);
        this.__dragDropHandler = dragDropHandler;
        dragDropHandler.RequestDragStartEvent.attach(this.__dragDropHandler__onRequestDragStart, this);
        dragDropHandler.DragStartEvent.attach(this.__dragDropHandler__onDragStart, this);
        dragDropHandler.DragMoveEvent.attach(this.__dragDropHandler__onDragMove, this);
        dragDropHandler.DragEndEvent.attach(this.__dragDropHandler__onDragEnd, this);
        dragDropHandler.DragCancelEvent.attach(this.__dragDropHandler__onDragCancel, this);
        dragDropHandler.DragEnterEvent.attach(this.__dragDropHandler__onDragEnter, this);
        dragDropHandler.DragOverEvent.attach(this.__dragDropHandler__onDragOver, this);
        dragDropHandler.DragLeaveEvent.attach(this.__dragDropHandler__onDragLeave, this);
        dragDropHandler.DragDropEvent.attach(this.__dragDropHandler__onDragDrop, this);

        this.__style = new ControlStyle(this);
        this.style!.display = "flex";
        this.style!.flex = "1";
        this.style!.maxWidth = "100%";
        this.style!.maxHeight = "100%";
    }

    protected __finalization() {
        //Destruct style
        this.domElement!.remove();
    }

    public initialize(domElement: Element) {
        assertParams({ domElement }, [Element]);

        if (this.isInitialized)
            throw new InvalidOperationException("Cannot initialize control. Control has already been initialized.");
        else {
            this.__domElement = domElement;
            this.__initialization();
            this.__isInitialized = true;
        }
    }

    public finalize() {
        if (this.isInitialized) {
            this.__finalization();
            this.__domElement = null;
            this.__isInitialized = false;
        }
        else
            throw new InvalidOperationException("Cannot finalize control. Control has not been initialized.");
    }

    get isInitialized(): boolean { return this.__isInitialized; }
    private __isInitialized: boolean = false;

    //Helper Class Instances
    protected __dragDropHandler!: DragDropHandler;

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

    //Native events
    MouseEnterEvent!: NativeEvent;
    MouseLeaveEvent!: NativeEvent;
    MouseDownEvent!: NativeEvent;
    MouseUpEvent!: NativeEvent;
    MouseMoveEvent!: NativeEvent;
    ClickEvent!: NativeEvent;

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

    //Mouse Leave Event
    private __onMouseLeave() {
        this.isMouseOver = false;
    }

    //Mouse Down Event
    private __onMouseDown() {
        this.isMouseDown = true;
    }

    //Mouse Up Event
    private __onMouseUp() {
        this.isMouseDown = false;
    }

    //Mouse Move Event
    private __onMouseMove() {
    }

    //Click Event
    private __onClick() {
    }

    //Framework Properties
    //State Properties
    //Mouse State Properties
    //Is Mouse Over Property
    static isMouseOverProperty = DependencyProperty.register(Control, "isMouseOver", { valueType: Type.get(Boolean), defaultValue: false });
    get isMouseOver(): boolean { return Blender.execute(this, DependencyObject, o => o.get(Control.isMouseOverProperty)); }
    set isMouseOver(value: boolean) { Blender.execute(this, DependencyObject, o => o.set(Control.isMouseOverProperty, value)); }

    //Is Mouse Down Property
    static isMouseDownProperty = DependencyProperty.register(Control, "isMouseDown", { valueType: Type.get(Boolean), defaultValue: false });
    get isMouseDown(): boolean { return Blender.execute(this, DependencyObject, o => o.get(Control.isMouseDownProperty)); }
    set isMouseDown(value: boolean) { Blender.execute(this, DependencyObject, o => o.set(Control.isMouseDownProperty, value)); }

    //Drag State Properties
    //Is Dragging Property
    static isDraggingProperty = DependencyProperty.register(Control, "isDragging", { valueType: Type.get(Boolean), defaultValue: false });
    get isDragging(): boolean { return Blender.execute(this, DependencyObject, o => o.get(Control.isDraggingProperty)); }
    set isDragging(value: boolean) { Blender.execute(this, DependencyObject, o => o.set(Control.isDraggingProperty, value)); }

    //Is Drag Over Property
    static isDragOverProperty = DependencyProperty.register(Control, "isDragOver", { valueType: Type.get(Boolean), defaultValue: false });
    get isDragOver(): boolean { return Blender.execute(this, DependencyObject, o => o.get(Control.isDragOverProperty)); }
    set isDragOver(value: boolean) { Blender.execute(this, DependencyObject, o => o.set(Control.isDragOverProperty, value)); }

    //Drag Properties
    static isDraggableProperty = DependencyProperty.register(Control, "isDraggable", { valueType: Type.get(Boolean), defaultValue: false });
    get isDraggable(): boolean { return Blender.execute(this, DependencyObject, o => o.get(Control.isDraggableProperty)); }
    set isDraggable(value: boolean) { Blender.execute(this, DependencyObject, o => o.set(Control.isDraggableProperty, value)); }

    //Autosize Mode Property
    static autosizeModeProperty = DependencyProperty.register(Control, "autosizeMode", { valueType: Type.get(Number), defaultValue: AutosizeMode.Both });
    get autosizeMode(): number { return Blender.execute(this, DependencyObject, o => o.get(Control.autosizeModeProperty)); }
    set autosizeMode(value: number) { Blender.execute(this, DependencyObject, o => o.set(Control.autosizeModeProperty, value)); }

    //Style Property
    get style(): ControlStyle | null { return this.__style; }
    private __style: ControlStyle | null = null;

    get domElement(): Element | null { return this.__domElement; }
    private __domElement: Element | null = null;

    protected destructor() {
        if (this.isInitialized)
            this.finalize();

        super.destructor();
    }
}