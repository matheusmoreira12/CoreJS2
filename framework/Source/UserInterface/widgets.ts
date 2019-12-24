import { Collection } from "../Standard/Collections";
import { PropertyAttributeBinding, BindingDirection, PropertyBinding } from "./Bindings";
import DragDropHandler from "./DragDropHandler";
import { FrameworkEvent, NativeEvent, BroadcastFrameworkEvent, FrameworkCustomEvent } from "../Standard/Events";
import { FrameworkProperty, BooleanAttributeValueConverter, EnumerationAttributeValueConverter, Utils, JSONAttributeValueConverter, FlagsAttributeValueConverter } from "./user-interface";
import { AutoScroller } from "./AutoScroller";
import { Enumeration } from "../Standard/Enumeration";
import { ArrayUtils, DomUtils } from "../Utils/utils";
import { ContextSelectionFlags } from "../Standard/ContextSelectionFlags";
import { InvalidOperationException } from "../Standard/Exceptions";

class VisualTreeManager {
    constructor(target: Widget) {
        this.target = target;
    }

    attachAll() {
        for (let element of this.elements)
            this.target.appendChild(element);
    }

    detachAll() {
        for (let element of this.elements)
            element.remove();
    }

    readonly target: Widget; 
    readonly elements: Collection<HTMLElement> = new Collection();
}

export abstract class Widget extends HTMLElement {
    constructor() {
        super();

        if (new.target === Widget)
            throw new InvalidOperationException("Invalid constructor");

        //Initialize Widget Lifecycle
        //Fill Visual Tree
        this.__fillVisualTree(this.__visualTreeManager);

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
    private __visualTreeManager = new VisualTreeManager(this);
    private __dragDropHandler = new DragDropHandler(this);

    //Widget Lifecycle Management
    protected abstract __fillVisualTree(manager: VisualTreeManager);

    protected connectedCallback() {
        this.__visualTreeManager.attachAll();
    }

    protected disconnectedCallback() {
        this.__visualTreeManager.detachAll();
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

/**
 * Content Presenter Definition
 */
export class JContentPresenter extends Widget {
    constructor() {
        super();

        new PropertyAttributeBinding(this, JContentPresenter.contentProperty, this, "content", { direction: BindingDirection.ToSource });
    }

    protected __fillVisualTree() {}

    //Framework Properties
    static contentProperty = new FrameworkProperty("content", { defaultValue: null });

    get content() { return JButton.contentProperty.get(this); }
    set content(value) { JButton.contentProperty.set(this, value); }
}

/**
 * Scroll Container Widget Definition
 */
let JScrollContainer = class JScrollContainer extends Widget {
    constructor() {
        super();

        //Attach Event Listeners
        this.__autoScroller.ScrollRequestStartEvent.attach(this.__autoScroller__onScrollRequestStart, this);

        //Create Bindings
        new PropertyAttributeBinding(this, JScrollContainer.isAutoScrollEnabledProperty, this, "autoscroll", { valueConverter: new BooleanAttributeValueConverter() });
    }

    protected __fillVisualTree(manager: VisualTreeManager) { }

    private __disableTouchInteraction() {
        this.style.touchAction = "unset";
    }

    private __enableTouchInteraction() {
        this.style.touchAction = "none";
    }

    private __forceAutoScroll() {
        this.__isAutoScrollForced = true;
    }

    private __unforceAutoScroll() {
        this.__isAutoScrollForced = false;
    }

    private __isAutoScrollForced: boolean;

    private __enterAutoScrollMode() {
        this.__disableTouchInteraction();
        this.__forceAutoScroll();
    }

    private __exitAutoScrollMode() {
        this.__enableTouchInteraction();
        this.__unforceAutoScroll();
    }

    //Event Listeners
    private __autoScroller__onScrollRequestStart(sender, args) {
        if (this.isAutoScrollEnabled || this.__isAutoScrollForced)
            args.acceptScroll();
    }

    private __autoScroller = new AutoScroller(this);

    private __dragDropHandler__onNotifyDragStart(sender, args) {
        this.__enterAutoScrollMode();
    }

    private __dragDropHandler__onNotifyDragEnd(sender, args) {
        this.__exitAutoScrollMode();
    }

    private __dragDropHandler__onNotifyDragCancel(sender, args) {
        this.__exitAutoScrollMode();
    }

    //Framework Events
    NotifyDragStartEvent = new BroadcastFrameworkEvent("DragDropHandler__NotifyDragStart", this.__dragDropHandler__onNotifyDragStart.bind(this));
    NotifyDragEndEvent = new BroadcastFrameworkEvent("DragDropHandler__NotifyDragEnd", this.__dragDropHandler__onNotifyDragEnd.bind(this));
    NotifyDragCancelEvent = new BroadcastFrameworkEvent("DragDropHandler__NotifyDragCancel", this.__dragDropHandler__onNotifyDragCancel.bind(this));

    //Framework Properties
    static isAutoScrollEnabledProperty = new FrameworkProperty("isAutoScrollEnabled", { defaultValue: false });

    get isAutoScrollEnabled() { return JScrollContainer.isAutoScrollEnabledProperty.get(this); }
    set isAutoScrollEnabled(value) { JScrollContainer.isAutoScrollEnabledProperty.set(this, value); }
};

customElements.define("j-scroll-container", JScrollContainer);

/**
 * Banner Widget Definition
 */
export const JBannerType = new Enumeration([
    "None",
    "Info",
    "Success",
    "Warning",
    "Error"
]);

let JBanner = class JBanner extends Widget {
    constructor() {
        super();

        JBanner.isOpenProperty.ChangeEvent.attach(this.__isOpenProperty__onChange, this);

        new PropertyAttributeBinding(this, JBanner.typeProperty, this, "type", { valueConverter: new EnumerationAttributeValueConverter(JBannerType) });
        new PropertyAttributeBinding(this, JBanner.isOpenProperty, this, "open", { valueConverter: new BooleanAttributeValueConverter() });
    }

    openEvent = new FrameworkCustomEvent(this, "open");
    closeEvent = new FrameworkCustomEvent(this, "close");

    protected __fillVisualTree(manager: VisualTreeManager) {
        //Visual Template
        this.__layoutPanel = document.createElement("j-wrap-panel");
        manager.elements.add(this.__layoutPanel);

        this.__messageSpan = document.createElement("span");
        this.__layoutPanel.appendChild(this.__messageSpan);
    }

    private __layoutPanel: HTMLElement;
    private __messageSpan: HTMLElement;

    private __cancelCloseTimeout() {
        if (this.__closeTimeoutHandle === null) return;

        clearTimeout(this.__closeTimeoutHandle);

        this.__closeTimeoutHandle = null;
    }

    private __closeTimeoutHandle: number = null;

    private __resetCloseTimeout() {
        this.__cancelCloseTimeout();

        if (!this.timeout) return;

        let self = this;

        function closeTimeoutDone() {
            self.close();
        }

        this.__closeTimeoutHandle = setTimeout(closeTimeoutDone, this.timeout * 1000, this);
    }

    private __open() {
        this.openEvent.invoke();

        this.__resetCloseTimeout();
    }

    private __close() {
        this.closeEvent.invoke();
    }

    open() { this.isOpen = true; }

    close() { this.isOpen = false; }

    static contentProperty = new FrameworkProperty("content", { defaultValue: "" });

    get content() { return JBanner.contentProperty.get(this); }
    set content(value) { JBanner.contentProperty.set(this, value); }

    static buttonBarContentProperty = new FrameworkProperty("buttonBarContent", { defaultValue: "" });

    get buttonBarContent() { return JBanner.buttonBarContentProperty.get(this); }
    set buttonBarContent(value) { JBanner.buttonBarContentProperty.set(this, value); }

    static typeProperty = new FrameworkProperty("type", { defaultValue: JBannerType.None });

    get type() { return JBanner.typeProperty.get(this); }
    set type(value) { JBanner.typeProperty.set(this, value); }

    static isOpenProperty = new FrameworkProperty("isOpen", { defaultValue: false });

    private __isOpenProperty__onChange(sender, args) {
        if (args.target === this) {
            if (args.newValue === true)
                this.__open();
            else
                this.__close();
        }
    }

    get isOpen() { return JBanner.isOpenProperty.get(this); }
    set isOpen(value) { JBanner.isOpenProperty.set(this, value); }

    static timeoutProperty = new FrameworkProperty("timeout", { defaultValue: 5 });

    get timeout() { return JBanner.timeoutProperty.get(this); }
    set timeout(value) { JBanner.timeoutProperty.set(this, value); }
};

window.customElements.define("j-banner", JBanner);

/**
 * Progress Bar Widget Definition
 */
class JProgressBar extends Widget {
    constructor() {
        super();

        FrameworkEvent.attachMultiple(this.__property__onChange.bind(this), JProgressBar.valueProperty.ChangeEvent,
            JProgressBar.minimumProperty.ChangeEvent, JProgressBar.maximumProperty.ChangeEvent,
            JProgressBar.isIndeterminateProperty.ChangeEvent);

        new PropertyAttributeBinding(this, JProgressBar.valueProperty, this, "value");
        new PropertyAttributeBinding(this, JProgressBar.maximumProperty, this, "maximum");
        new PropertyAttributeBinding(this, JProgressBar.minimumProperty, this, "minimum");
        new PropertyAttributeBinding(this, JProgressBar.isIndeterminateProperty, this, "indeterminate", { valueConverter: new BooleanAttributeValueConverter() });
    }

    protected __fillVisualTree(manager: VisualTreeManager) {
        //Visual Tree
        this.__progressBarFill = document.createElement("j-progress-bar-fill");
        manager.elements.add(this.__progressBarFill);

        this.__update();
    }

    private __update() {
        if (this.isIndeterminate) {
            this.__progressBarFill.style.width = "100%";
            this.__progressBarFill.classList.add("indeterminate");
        }
        else {
            this.__progressBarFill.style.width = this.valueInPercent + "%";
            this.__progressBarFill.classList.remove("indeterminate");
        }
    }

    private __progressBarFill: HTMLElement;

    private __property__onChange(sender, args) {
        if (args.target === this) {
            this.__update();

            if (args.property === JProgressBar.valueProperty)
                this.isIndeterminate = false;
        }
    }

    get valueInPercent() {
        return (this.value - this.minimum) / (this.maximum - this.minimum) * 100;
    }

    static isIndeterminateProperty = new FrameworkProperty("isIndeterminate", { defaultValue: true });

    get isIndeterminate() { return JProgressBar.isIndeterminateProperty.get(this); }
    set isIndeterminate(value) { JProgressBar.isIndeterminateProperty.set(this, value); }

    static valueProperty = new FrameworkProperty("value", {});

    get value() { return JProgressBar.valueProperty.get(this); }
    set value(value) { JProgressBar.valueProperty.set(this, value); }

    static minimumProperty = new FrameworkProperty("minimum", { defaultValue: 0 });

    get minimum() { return JProgressBar.minimumProperty.get(this); }
    set minimum(value) { JProgressBar.minimumProperty.set(this, value); }

    static maximumProperty = new FrameworkProperty("maximum", { defaultValue: 1 });

    get maximum() { return JProgressBar.maximumProperty.get(this); }
    set maximum(value) { JProgressBar.maximumProperty.set(this, value); }
}

window.customElements.define("j-progress-bar", JProgressBar);

/*
 * Button Widget Definition
 */
export const ButtonIconPosition = new Enumeration([
    "Top",
    "Right",
    "Bottom",
    "Left"
]);

export class JButton extends Widget {
    constructor() {
        super();

        //Create Bindings
        new PropertyAttributeBinding(this, JButton.isDefaultProperty, this, "default", { valueConverter: new BooleanAttributeValueConverter() });
        new PropertyAttributeBinding(this, JButton.valueProperty, this, "value", { valueConverter: new BooleanAttributeValueConverter() });
        new PropertyAttributeBinding(this, JButton.contentProperty, this, "content", { direction: BindingDirection.ToSource });
        new PropertyAttributeBinding(this, JButton.iconProperty, this, "icon", { valueConverter: new EnumerationAttributeValueConverter(ButtonIconPosition) });
    }

    protected __fillVisualTree(manager: VisualTreeManager) { }

    //Framework Properties
    static isDefaultProperty = new FrameworkProperty("isDefault", { defaultValue: false });

    get isDefault() { return JButton.isDefaultProperty.get(this); }
    set isDefault(value) { JButton.isDefaultProperty.set(this, value); }

    static valueProperty = new FrameworkProperty("value", { defaultValue: null });

    get value() { return JButton.valueProperty.get(this); }
    set value(value) { JButton.valueProperty.set(this, value); }

    static contentProperty = new FrameworkProperty("content", { defaultValue: null });

    get content() { return JButton.contentProperty.get(this); }
    set content(value) { JButton.contentProperty.set(this, value); }

    static iconProperty = new FrameworkProperty("icon", { defaultValue: null });

    get icon() { return JButton.iconProperty.get(this); }
    set icon(value) { JButton.iconProperty.set(this, value); }
}

/*
 * Button Bar Widget Definition
 */
const DEFAULT__BUTTON__DATA = {
    text: "",
    value: null,
    isDefault: false
};

class JButtonBar extends Widget {
    constructor() {
        super();

        JButtonBar.buttonsProperty.ChangeEvent.attach(this.__buttonsProperty__onChange, this);
    }

    protected __fillVisualTree(manager) {
        //Visual tree
        this.__layoutPanel = document.createElement("j-wrap-panel");
        manager.elements.add(this.__layoutPanel);
    }

    private __layoutPanel: HTMLElement;

    private __addButton(data, position) {
        data = Object.assign({}, DEFAULT__BUTTON__DATA, data);

        //Create and initialize button
        let button = <JButton>document.createElement("j-button");
        button.innerText = data.text;
        button.value = data.value;

        if (data.isDefault)
            button.focus();

        //Insert button to the appropriate container
        DomUtils.insertElementAt(this.__layoutPanel, position, button);

        let self = this;

        button.onclick = function () {
            self.__invokeOnSubmit(button.value);
        };
    }

    private __removeButton(position) {
        //Retrieve button element
        let button = this.__layoutPanel.children[position];

        button.remove();
    }

    private __updateButton(position) {

    }

    private __updateButtons(oldButtons, newButtons) {
        ArrayUtils.detectArrayChanges(oldButtons, newButtons,
            (newItem, newIndex) => {
                this.__addButton(newItem, newIndex);
            },
            (oldItem, oldIndex) => {
                this.__removeButton(oldItem);
            },
            (oldItem, newItem, index) => {
                this.__updateButton(oldItem);
            }
        );
    }

    static buttonsProperty = new FrameworkProperty("buttons", { defaultValue: [] });

    private __buttonsProperty__onChange(sender, args) {
        if (args.target === this) {
            this.__updateButtons(args.oldValue, args.newValue);
        }
    }

    get buttons() { return JButtonBar.buttonsProperty.get(this); }
    set buttons(value) { JButtonBar.buttonsProperty.set(this, value); }

    SubmitEvent = new FrameworkCustomEvent(this, "submit");

    private __invokeOnSubmit(value) {
        this.SubmitEvent.invoke({ value: value });
    }
}

window.customElements.define("j-button-bar", JButtonBar);

export class DialogManager {

    private __openDialogs = new Collection();

    showModal(options) {
        return new Promise((resolve, reject) => {

            let dialog = <JDialog>document.createElement("j-dialog");

            document.body.appendChild(dialog);

            //Associate properties
            dialog.title = options.title;
            dialog.content = options.content;
            dialog.buttons = options.buttons;
            dialog.options = {
                showTitleBar: options.showTitleBar,
                showCloseButton: options.showCloseButton,
                showButtonBar: options.showButtonBar
            };

            dialog.open();

            function dialog__onClose() {
                resolve();
            }

            dialog.closeEvent.attach(dialog__onClose);

            this.__openDialogs.add(dialog);
        });
    }
};

export let dialogManager = new DialogManager();

const DEFAULT__DIALOG__OPTIONS = {
    showTitleBar: true,
    showButtonBar: true,
    showCloseButton: true
};

/*
 * Dialog Widget Definition
 */
class JDialog extends Widget {
    constructor() {
        super();

        JDialog.titleProperty.ChangeEvent.attach(this.__titleProperty__onChange, this);
        JDialog.contentProperty.ChangeEvent.attach(this.__contentProperty__onChange, this);
        JDialog.isOpenProperty.ChangeEvent.attach(this.__isOpenProperty__onChange, this);

        new PropertyAttributeBinding(this, JDialog.isOpenProperty, this, "open", { valueConverter: new BooleanAttributeValueConverter() });
        new PropertyAttributeBinding(this, JDialog.optionsProperty, this, "options", { valueConverter: new JSONAttributeValueConverter() });
        new PropertyAttributeBinding(this, JDialog.buttonsProperty, this, "buttons", { valueConverter: new JSONAttributeValueConverter() });

        new PropertyBinding(this, JDialog.buttonsProperty, this.__buttonBar, JButtonBar.buttonsProperty);
    }

    openEvent = new FrameworkCustomEvent(this, "open");
    closeEvent = new FrameworkCustomEvent(this, "close");

    protected __fillVisualTree(manager: VisualTreeManager) {
        let self = this;

        //Events
        function closeButtonClick() {
            self.close();
        }

        //Visual Template
        this.__layoutCenterPanel = document.createElement("j-center-panel");
        manager.elements.add(this.__layoutCenterPanel);

        this.__dialogWindow = document.createElement("j-dialog-window");
        this.__layoutCenterPanel.appendChild(this.__dialogWindow);

        this.__dialogWindowLayoutPanel = document.createElement("j-stack-panel");
        this.__dialogWindow.appendChild(this.__dialogWindowLayoutPanel);

        this.__titleBar = document.createElement("j-dialog-title-bar");
        this.__dialogWindowLayoutPanel.appendChild(this.__titleBar);

        this.__titleBarLayoutPanel = document.createElement("j-wrap-panel");
        this.__titleBar.appendChild(this.__titleBarLayoutPanel);

        this.__titleSpan = document.createElement("span");
        this.__titleBarLayoutPanel.appendChild(this.__titleSpan);

        this.__closeButton = document.createElement("j-button");
        this.__titleBarLayoutPanel.appendChild(this.__closeButton);
        this.__closeButton.textContent = "X";
        this.__closeButton.classList.add("close-button");
        this.__closeButton.onclick = closeButtonClick;

        this.__contentWrapper = document.createElement("j-dialog-content-wrapper");
        this.__dialogWindowLayoutPanel.appendChild(this.__contentWrapper);

        this.__buttonBar = <JButtonBar>document.createElement("j-button-bar");
        this.__dialogWindowLayoutPanel.appendChild(this.__buttonBar);
        this.__buttonBar.SubmitEvent.attach(this.__buttonBar__onSubmit, this);
    }

    private __layoutCenterPanel: HTMLElement;
    private __dialogWindow: HTMLElement;
    private __dialogWindowLayoutPanel: HTMLElement;
    private __titleBar: HTMLElement;
    private __titleBarLayoutPanel: HTMLElement;
    private __titleSpan: HTMLElement;
    private __closeButton: HTMLElement;
    private __contentWrapper: HTMLElement;
    private __buttonBar: JButtonBar;

    private __buttonBar__onSubmit(args) {
        this.__submit();
    }

    private __open() {
        this.openEvent.invoke();
    }

    private __close() {
        this.closeEvent.invoke();
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    updateOptions() {
        let options = Object.assign({}, DEFAULT__DIALOG__OPTIONS, this.options);

        this.__titleBar.hidden = !options.showTitleBar;
        this.__buttonBar.hidden = !options.showButtonBar;
        this.__closeButton.hidden = !options.showCloseButton;
    }

    static titleProperty = new FrameworkProperty("title", { defaultValue: "" });

    private __titleProperty__onChange(sender, args) {
        if (args.target === this) {
            this.__titleSpan.innerText = args.newValue;
        }
    }

    get title() { return JDialog.titleProperty.get(this); }
    set title(value) { JDialog.titleProperty.set(this, value); }

    static contentProperty = new FrameworkProperty("content", { defaultValue: "" });

    private __contentProperty__onChange(sender, args) {
        if (args.target === this) {
            this.__contentWrapper.innerHTML = args.newValue;
        }
    }

    get content() { return JDialog.contentProperty.get(this); }
    set content(value) { JDialog.contentProperty.set(this, value); }

    static buttonsProperty = new FrameworkProperty("buttons", { defaultValue: [] });

    get buttons() { return JDialog.buttonsProperty.get(this); }
    set buttons(value) { JDialog.buttonsProperty.set(this, value); }

    static isOpenProperty = new FrameworkProperty("isOpen", { defaultValue: false });

    private __isOpenProperty__onChange(sender, args) {
        if (args.target === this) {
            if (args.value === true)
                this.__open();
            else
                this.__close();
        }
    }

    get isOpen() { return JDialog.isOpenProperty.get(this); }
    set isOpen(value) { JDialog.isOpenProperty.set(this, value); }

    static optionsProperty = new FrameworkProperty("options", {});

    get options() { return JDialog.optionsProperty.get(this); }
    set options(value) { JDialog.optionsProperty.set(this, value); }
}

window.customElements.define("j-dialog", JDialog);

/*Board Widget*/
class JBoard extends Widget {
    constructor() {
        super();

        this.ondragover = this.__dragover__handler;
        this.ondrop = this.__drop__handler;
        this.ondragleave = this.__dragleave__handler;

        new PropertyAttributeBinding(this, JBoard.contextProperty, this, "context", { valueConverter: new FlagsAttributeValueConverter() });
        new PropertyAttributeBinding(this, JBoard.dataProperty, this, "data", { valueConverter: new JSONAttributeValueConverter() });
        new PropertyAttributeBinding(this, JBoard.acceptsDropProperty, this, "acceptsDrop", { valueConverter: new BooleanAttributeValueConverter() });
    }

    cardDropEvent = new FrameworkCustomEvent(this, "carddrop");

    private __invokeCardDrop(cardData, boardData, context) {
        this.cardDropEvent.invoke({
            cardData: cardData,
            boardData: boardData,
            context: context
        });
    }

    private __onDragEnter(sender, args) {
        let { acceptDrop } = args;

        let sourceContextStr = args.getContext();
        if (!sourceContextStr) return;

        let sourceContext = ContextSelectionFlags.parse(sourceContextStr);

        if (!this.acceptsDrop ||
            !this.context.matches(sourceContext)) return;

        acceptDrop();
    }

    private __onDragOver(sender, args) {
        this.__applyDragOverVisualStyle();
    }

    private __onDragLeave(sender, args) {
        this.__removeDragOverVisualStyle();
    }

    private __canAcceptDrop(data) {
        if (data === null) return false;

        if (data.type !== "card") return false;

        return true;
    }

    private __onDragDrop(sender, args) {
        let { getData } = args;

        let data = getData();

        if (this.__canAcceptDrop(data))
            this.__invokeCardDrop(data.cardData, this.data, this.context);

        this.__removeDragOverVisualStyle();
    }

    private __applyDragOverVisualStyle() { this.classList.add("drag-over"); }

    private __removeDragOverVisualStyle() { this.classList.remove("drag-over"); }

    static contextProperty = new FrameworkProperty("context", { defaultValue: ContextSelectionFlags.all });

    get context() { return JBoard.contextProperty.get(this); }
    set context(value) { JBoard.contextProperty.set(this, value); }

    static dataProperty = new FrameworkProperty("data", { defaultValue: null });

    get data() { return JBoard.dataProperty.get(this); }
    set data(value) { JBoard.dataProperty.set(this, value); }

    static acceptsDropProperty = new FrameworkProperty("acceptsDrop", { defaultValue: true });

    get acceptsDrop() { return JBoard.acceptsDropProperty.get(this); }
    set acceptsDrop(value) { JBoard.acceptsDropProperty.set(this, value); }
}

customElements.define("j-board", JBoard);

/*Card Widget*/
class JCard extends Widget {
    constructor() {
        super();

        new PropertyAttributeBinding(this, JCard.contextProperty, this, "context", { valueConverter: new FlagsAttributeValueConverter() });
        new PropertyAttributeBinding(this, JCard.dataProperty, this, "data", { valueConverter: new JSONAttributeValueConverter() });
    }

    private __fillVisualTree(manager) {
        super.__fillVisualTree(manager);

        //Visual Tree
        this.__fieldsStackPanel = document.createElement("j-stack-panel");
        this.appendChild(this.__fieldsStackPanel);
    }

    private __applyDragVisualStyle() {
        this.classList.add("dragging");
    }

    private __onDragStart(sender, args) {
        let data = {
            type: "card",
            cardData: this.data
        };

        args.setData(data);

        let contextStr = this.context.toString();

        args.setContext(contextStr);

        this.__applyDragVisualStyle();
    }

    private __removeDragVisualStyle() {
        this.classList.remove("dragging");
    }

    private __onDragEnd(sender, args) {
        this.__removeDragVisualStyle();
    }

    private __onDragCancel(sender, args) {
        this.__removeDragVisualStyle();
    }

    static contextProperty = new FrameworkProperty("context", { defaultValue: ContextSelectionFlags.all });

    get context() { return JCard.contextProperty.get(this); }
    set context(value) { JCard.contextProperty.set(this, value); }

    static dataProperty = new FrameworkProperty("data", { defaultValue: null });

    get data() { return JCard.dataProperty.get(this); }
    set data(value) { JCard.dataProperty.set(this, value); }
}

window.customElements.define("j-card", JCard);

/*Editable Label Widget*/
class JEditableLabel extends Widget {
    constructor() {
        super();

        this.ondblclick = this.__dblclick__handler;
        this.onblur = this.__blur__handler;
        this.onkeydown = this.__keydown__handler;

        JEditableLabel.isEditingProperty.ChangeEvent.attach(this.__isEditing__onChange, this);

        new PropertyAttributeBinding(this, JEditableLabel.isEditingProperty, this, "editing", { valueConverter: new BooleanAttributeValueConverter() });
    }

    private __invokeStartEdit() {
        this.startEditEvent.invoke();
    }

    private __invokeEndEdit(text, canceled) {
        this.endEditEvent.invoke({
            text: text,
            canceled: canceled
        });
    }

    private __invokeConfirmEdit(text) {
        this.confirmEditEvent.invoke({
            text: text
        });
    }

    private __invokeCancelEdit(text) {
        this.cancelEditEvent.invoke({
            text: text
        });
    }

    private __openEditing() {
        this.__cachedText = this.textContent;

        this.contentEditable = "contentEditable";

        Utils.selectAllText(this);

        this.focus();

        this.startEditEvent.invoke();
    }

    private __closeEditing() {
        this.contentEditable = null;

        Utils.deselectAllText();
    }

    private __applyAndClose() {
        let text = this.textContent;

        this.closeEditing();

        this.__invokeConfirmEdit(text);
        this.__invokeEndEdit(text, false);
    }

    private __discardAndClose() {
        this.textContent = this.__cachedText;

        this.closeEditing();

        this.__invokeCancelEdit(this.textContent);
        this.__invokeEndEdit(this.textContent, true);
    }

    private __dblclick__handler(ev) {
        const MOUSE__LEFT__BUTTON = 1;

        if (ev.button !== MOUSE__LEFT__BUTTON)
            this.openEditing();
    }

    private __blur__handler() {
        this.__discardAndClose();
    }

    private __keydown__handler(ev) {
        if (ev.key === "Escape")
            this.__discardAndClose();
        else if (ev.key === "Enter")
            this.__applyAndClose();
    }

    openEditing() { this.isEditing = true; }
    closeEditing() { this.isEditing = false; }

    private __cachedText = "";

    startEditEvent = new FrameworkCustomEvent(this, "startedit");
    endEditEvent = new FrameworkCustomEvent(this, "endedit");
    confirmEditEvent = new FrameworkCustomEvent(this, "confirmedit");
    cancelEditEvent = new FrameworkCustomEvent(this, "canceledit");

    static isEditingProperty = new FrameworkProperty("isEditing", { defaultValue: false });

    private __isEditing__onChange(sender, args) {
        if (args.target === this) {
            if (args.newValue)
                this.__openEditing();
            else
                this.__closeEditing();
        }
    }

    get isEditing() { return JEditableLabel.isEditingProperty.get(this); }
    set isEditing(value) { JEditableLabel.isEditingProperty.set(this, value); }
}

customElements.define("j-editable-label", JEditableLabel);

/*Spinner Widget*/
class JSpinner extends Widget {

    private __fillVisualTree(manager) {
        super.__fillVisualTree(manager);

        let layoutCenterPanel = document.createElement("j-center-panel");
        manager.elements.add(layoutCenterPanel);

        let spinnerImage = new Image(80, 80);
        spinnerImage.src = "styles/images/loader.svg";
        layoutCenterPanel.appendChild(spinnerImage);

        this.__layoutCenterPanel = layoutCenterPanel;
        this.__spinnerImage = spinnerImage;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
    }

    static isOpenProperty = new FrameworkProperty("isOpen", {});
    get isOpen() { return JBanner.isOpenProperty.get(this); }
    set isOpen(value) { JBanner.isOpenProperty.set(this, value); }
}

customElements.define("j-spinner", JSpinner);