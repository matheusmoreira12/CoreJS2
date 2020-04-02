import { InvalidOperationException, Enumeration } from "../../Standard/index";
import { DragDropHandler } from "../index";
import { FrameworkEvent, NativeEvent, FrameworkEventArgs } from "../../Standard/Events/index";
import { DependencyProperty, DependencyObject } from "../DependencyObjects/index";
import { Type } from "../../Standard/Types/Type";
import { VisualTreeElement } from "../VisualTrees/index";
import { Blender } from "../../Standard/Blender/Blender";
import { PropertyAttributeBinding, BindingDirection } from "../Bindings/index";
import { Length, Size } from "../Coordinates/index";
import { AutosizeMode } from "./AutosizeMode";
import { ControlTemplate } from "./Templating/index";

///TODO: fix this mess

export abstract class Control extends VisualTreeElement {
    constructor(qualifiedName: string, namespaceURI: string | null = null) {
        super(qualifiedName, namespaceURI);

        if (new.target === Control)
            throw new InvalidOperationException("Invalid constructor");
    }

    protected __initialization() {
        super.__initialization();

        Blender.execute(this, DependencyObject, o => new PropertyAttributeBinding(o, Control.isDraggableProperty, this.domElement, "core:isDraggable", "core", { direction: BindingDirection.ToTarget }));

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
    }

    protected __finalization() {
        super.__finalization();
    }

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

    //Autosize Methods
    protected __computeSize(): Size {
        return Size.pixels(1, 1);
    }

    protected __updateSize(size: Size) {
        if (this.width.equals(Length.auto)) {
            const widthPixels = size.width.toPixels(),
                actualWidthPixels = this.actualWidth.toPixels();
            const canGrowWidth = Enumeration.contains(AutosizeMode.Grow, this.autosizeMode),
                canShrinkWidth = Enumeration.contains(AutosizeMode.Shrink, this.autosizeMode);
            if (widthPixels > actualWidthPixels && canGrowWidth ||
                widthPixels < actualWidthPixels && canShrinkWidth)
                this.actualWidth = Length.pixels(widthPixels);
        }
        if (this.height.equals(Length.auto)) {
            const heightPixels = size.height.toPixels(),
                actualHeightPixels = this.actualHeight.toPixels();
            const canGrowHeight = Enumeration.contains(AutosizeMode.Grow, this.autosizeMode),
                canShrinkHeight = Enumeration.contains(AutosizeMode.Shrink, this.autosizeMode);
            if (heightPixels > actualHeightPixels && canGrowHeight ||
                heightPixels < actualHeightPixels && canShrinkHeight)
                this.actualHeight = Length.pixels(heightPixels);
        }
    }

    invalidateSize() {
        const computedSize = this.__computeSize();
        this.__updateSize(computedSize);
    }

    protected __updateVisual() { }

    invalidateVisual() {
        this.__updateVisual();
    }

    invalidateAll() {
        this.invalidateVisual();
        this.invalidateSize();
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

    //Visual Properties
    //Width Property
    static widthProperty = DependencyProperty.register(Control, "width", { valueType: Type.get(Length), defaultValue: Length.pixels(200) });
    get width(): Length { return Blender.execute(this, DependencyObject, o => o.get(Control.widthProperty)); }
    set width(value: Length) { Blender.execute(this, DependencyObject, o => o.set(Control.widthProperty, value)); }

    //Height Property
    static heightProperty = DependencyProperty.register(Control, "height", { valueType: Type.get(Length), defaultValue: Length.pixels(200) });
    get height(): Length { return Blender.execute(this, DependencyObject, o => o.get(Control.heightProperty)); }
    set height(value: Length) { Blender.execute(this, DependencyObject, o => o.set(Control.heightProperty, value)); }

    //Width Property
    static actualWidthProperty = DependencyProperty.register(Control, "actualWidth", { valueType: Type.get(Length), defaultValue: 0 });
    get actualWidth(): Length { return Blender.execute(this, DependencyObject, o => o.get(Control.actualWidthProperty)); }
    set actualWidth(value: Length) { Blender.execute(this, DependencyObject, o => o.set(Control.actualWidthProperty, value)); }

    //Height Property
    static actualHeightProperty = DependencyProperty.register(Control, "actualHeight", { valueType: Type.get(Length), defaultValue: AutosizeMode.Both });
    get actualHeight(): Length { return Blender.execute(this, DependencyObject, o => o.get(Control.actualHeightProperty)); }
    set actualHeight(value: Length) { Blender.execute(this, DependencyObject, o => o.set(Control.actualHeightProperty, value)); }

    //Autosize Mode Property
    static autosizeModeProperty = DependencyProperty.register(Control, "autosizeMode", { valueType: Type.get(Number), defaultValue: AutosizeMode.Both });
    get autosizeMode(): number { return Blender.execute(this, DependencyObject, o => o.get(Control.autosizeModeProperty)); }
    set autosizeMode(value: number) { Blender.execute(this, DependencyObject, o => o.set(Control.autosizeModeProperty, value)); }

    //Background Property
    static backgroundProperty = DependencyProperty.register(Control, "background", { valueType: Type.get(String), defaultValue: "#000" });
    get background() { return Blender.execute(this, DependencyObject, o => o.get(Control.backgroundProperty)); }
    set background(value) { Blender.execute(this, DependencyObject, o => o.set(Control.backgroundProperty, value)); }

    //Foreground Property
    static foregroundProperty = DependencyProperty.register(Control, "foreground", { valueType: Type.get(String), defaultValue: "#000" });
    get foreground() { return Blender.execute(this, DependencyObject, o => o.get(Control.foregroundProperty)); }
    set foreground(value) { Blender.execute(this, DependencyObject, o => o.set(Control.foregroundProperty, value)); }
}