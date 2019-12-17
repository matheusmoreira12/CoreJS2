﻿var _a, _b;
class VisualTreeManager {
    constructor(target) {
        this.elements = new Collection();
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
}
export class Widget extends HTMLElement {
    constructor() {
        super();
        //Helper Class Instances
        this._visualTreeManager = new VisualTreeManager(this);
        this._dragDropHandler = new DragDropHandler(this);
        this.DragStartEvent = new FrameworkEvent(this._onDragStart.bind(this));
        this.DragMoveEvent = new FrameworkEvent(this._onDragMove.bind(this));
        this.DragEndEvent = new FrameworkEvent(this._onDragEnd.bind(this));
        this.DragCancelEvent = new FrameworkEvent(this._onDragCancel.bind(this));
        this.DragEnterEvent = new FrameworkEvent(this._onDragEnter.bind(this));
        this.DragOverEvent = new FrameworkEvent(this._onDragOver.bind(this));
        this.DragLeaveEvent = new FrameworkEvent(this._onDragLeave.bind(this));
        this.DragDropEvent = new FrameworkEvent(this._onDragDrop.bind(this));
        this.MouseEnterEvent = new NativeEvent(this, "mouseenter", this._onMouseEnter.bind(this));
        this.MouseLeaveEvent = new NativeEvent(this, "mouseleave", this._onMouseLeave.bind(this));
        this.MouseDownEvent = new NativeEvent(this, "mousedown", this._onMouseDown.bind(this));
        this.MouseMoveEvent = new NativeEvent(this, "mousemove", this._onMouseMove.bind(this));
        this.MouseUpEvent = new NativeEvent(this, "mouseup", this._onMouseUp.bind(this));
        this.ClickEvent = new NativeEvent(this, "click", this._onClick.bind(this));
        //Initialize Widget Lifecycle
        //Fill Visual Tree
        this._fillVisualTree(this._visualTreeManager);
        //Create Bindings
        new PropertyAttributeBinding(this, Widget.isDraggableProperty, this, "draggable", { valueConverter: new BooleanAttributeValueConverter() });
        //Attach Event Handlers
        //  Drag/Drop Handler Events
        this._dragDropHandler.RequestDragStartEvent.attach(this._dragDropHandler_onRequestDragStart, this);
        this._dragDropHandler.DragStartEvent.attach(this._dragDropHandler_onDragStart, this);
        this._dragDropHandler.DragMoveEvent.attach(this._dragDropHandler_onDragMove, this);
        this._dragDropHandler.DragEndEvent.attach(this._dragDropHandler_onDragEnd, this);
        this._dragDropHandler.DragCancelEvent.attach(this._dragDropHandler_onDragCancel, this);
        this._dragDropHandler.DragEnterEvent.attach(this._dragDropHandler_onDragEnter, this);
        this._dragDropHandler.DragOverEvent.attach(this._dragDropHandler_onDragOver, this);
        this._dragDropHandler.DragLeaveEvent.attach(this._dragDropHandler_onDragLeave, this);
        this._dragDropHandler.DragDropEvent.attach(this._dragDropHandler_onDragDrop, this);
    }
    //Widget Lifecycle Management
    _fillVisualTree(manager) { }
    connectedCallback() {
        this._visualTreeManager.attachAll();
    }
    disconnectedCallback() {
        this._visualTreeManager.detachAll();
    }
    //Drag/Drop Handler Event Listeners
    _dragDropHandler_onRequestDragStart(sender, args) {
        let { acceptDrag } = args;
        if (this.isDraggable)
            acceptDrag();
    }
    _dragDropHandler_onDragStart(sender, args) {
        this.DragStartEvent.invoke(this, args);
    }
    _dragDropHandler_onDragMove(sender, args) {
        this.DragMoveEvent.invoke(this, args);
    }
    _dragDropHandler_onDragEnd(sender, args) {
        this.DragEndEvent.invoke(this, args);
    }
    _dragDropHandler_onDragCancel(sender, args) {
        this.DragCancelEvent.invoke(this, args);
    }
    _dragDropHandler_onDragEnter(sender, args) {
        this.DragEnterEvent.invoke(this, args);
    }
    _dragDropHandler_onDragOver(sender, args) {
        this.DragOverEvent.invoke(this, args);
    }
    _dragDropHandler_onDragLeave(sender, args) {
        this.DragLeaveEvent.invoke(this, args);
    }
    _dragDropHandler_onDragDrop(sender, args) {
        this.DragDropEvent.invoke(this, args);
    }
    //Framework Events
    //  Drag/Drop Events
    _onDragMove(sender, args) { }
    _onDragStart(sender, args) {
        this.isDragging = true;
    }
    _onDragEnd(sender, args) {
        this.isDragging = false;
    }
    _onDragCancel(sender, args) {
        this.isDragging = false;
    }
    _onDragEnter(sender, args) { }
    _onDragOver(sender, args) {
        this.isDragOver = true;
    }
    _onDragLeave(sender, args) {
        this.isDragOver = false;
    }
    _onDragDrop(sender, args) {
        this.isDragOver = false;
    }
    //  Mouse Events
    //      Mouse Enter Event
    _onMouseEnter(sender, args) {
        this.isMouseOver = true;
    }
    //      Mouse Leave Event
    _onMouseLeave(sender, args) {
        this.isMouseOver = false;
    }
    //      Mouse Down Event
    _onMouseDown(sender, args) { }
    //      Mouse Move Event
    _onMouseMove(sender, args) { }
    //      Mouse Up Event
    _onMouseUp(sender, args) { }
    //      Click Event
    _onClick(sender, args) { }
    get isMouseOver() { return Widget.isMouseOverProperty.get(this); }
    set isMouseOver(value) { Widget.isMouseOverProperty.get(this, value); }
    get isDragging() { return Widget.isDraggingProperty.get(this); }
    set isDragging(value) { Widget.isDraggingProperty.get(this, value); }
    get isDragOver() { return Widget.isDragOverProperty.get(this); }
    set isDragOver(value) { Widget.isDragOverProperty.get(this, value); }
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
/**
 * Content Presenter Definition
 */
export class JContentPresenter extends Widget {
    constructor() {
        super();
        new PropertyAttributeBinding(this, JContentPresenter.contentProperty, this, "content", { direction: BindingDirection.ToSource });
    }
    get content() { return JButton.contentProperty.get(this); }
    set content(value) { return JButton.contentProperty.set(this, value); }
}
//Framework Properties
JContentPresenter.contentProperty = new FrameworkProperty("content", { defaultValue: null });
/**
 * Scroll Container Widget Definition
 */
let JScrollContainer = (_a = class JScrollContainer extends Widget {
        constructor() {
            super();
            this._autoScroller = new AutoScroller(this);
            //Framework Events
            this.NotifyDragStartEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragStart", this._dragDropHandler_onNotifyDragStart.bind(this));
            this.NotifyDragEndEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragEnd", this._dragDropHandler_onNotifyDragEnd.bind(this));
            this.NotifyDragCancelEvent = new BroadcastFrameworkEvent("DragDropHandler_NotifyDragCancel", this._dragDropHandler_onNotifyDragCancel.bind(this));
            //Attach Event Listeners
            this._autoScroller.ScrollRequestStartEvent.attach(this._autoScroller_onScrollRequestStart, this);
            //Create Bindings
            new PropertyAttributeBinding(this, JScrollContainer.isAutoScrollEnabledProperty, this, "autoscroll", { valueConverter: new BooleanAttributeValueConverter() });
        }
        _disableTouchInteraction() {
            this.style.touchAction = "unset";
        }
        _enableTouchInteraction() {
            this.style.touchAction = "none";
        }
        _forceAutoScroll() {
            this._forceAutoScrollIsForced = true;
        }
        _unforceAutoScroll() {
            this._forceAutoScrollIsForced = false;
        }
        _enterAutoScrollMode() {
            this._disableTouchInteraction();
            this._forceAutoScroll();
        }
        _exitAutoScrollMode() {
            this._enableTouchInteraction();
            this._unforceAutoScroll();
        }
        //Event Listeners
        _autoScroller_onScrollRequestStart(sender, args) {
            if (this.isAutoScrollEnabled || this._forceAutoScrollIsForced)
                args.acceptScroll();
        }
        _dragDropHandler_onNotifyDragStart(sender, args) {
            this._enterAutoScrollMode();
        }
        _dragDropHandler_onNotifyDragEnd(sender, args) {
            this._exitAutoScrollMode();
        }
        _dragDropHandler_onNotifyDragCancel(sender, args) {
            this._exitAutoScrollMode();
        }
        get isAutoScrollEnabled() { return JScrollContainer.isAutoScrollEnabledProperty.get(this); }
        set isAutoScrollEnabled(value) { JScrollContainer.isAutoScrollEnabledProperty.set(this, value); }
    },
    //Framework Properties
    _a.isAutoScrollEnabledProperty = new FrameworkProperty("isAutoScrollEnabled", { defaultValue: false }),
    _a);
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
let JBanner = (_b = class JBanner extends Widget {
        constructor() {
            super();
            this.openEvent = new FrameworkCustomEvent(this, "open");
            this.closeEvent = new FrameworkCustomEvent(this, "close");
            JBanner.isOpenProperty.ChangeEvent.attach(this._isOpenProperty_onChange, this);
            new PropertyAttributeBinding(this, JBanner.typeProperty, this, "type", { valueConverter: new EnumerationAttributeValueConverter(JBannerType) });
            new PropertyAttributeBinding(this, JBanner.isOpenProperty, this, "open", { valueConverter: new BooleanAttributeValueConverter() });
        }
        _fillVisualTree(manager) {
            super._fillVisualTree();
            //Visual Template
            this._layoutPanel = document.createElement("j-wrap-panel");
            manager.elements.add(this._layoutPanel);
            this._messageSpan = document.createElement("span");
            this._layoutPanel.appendChild(this._messageSpan);
        }
        _cancelCloseTimeout() {
            if (this._closeTimeout === null)
                return;
            clearTimeout(this._closeTimeout);
            this._closeTimeout = null;
        }
        _resetCloseTimeout() {
            this._cancelCloseTimeout();
            if (!this.timeout)
                return;
            let self = this;
            function closeTimeoutDone() {
                self.close();
            }
            this._closeTimeout = setTimeout(closeTimeoutDone, this.timeout * 1000, this);
        }
        _open() {
            this.openEvent.invoke();
            this._resetCloseTimeout();
        }
        _close() {
            this.closeEvent.invoke();
        }
        open() { this.isOpen = true; }
        close() { this.isOpen = false; }
        get content() { return JBanner.contentProperty.get(this); }
        set content(value) { JBanner.contentProperty.set(this, value); }
        get buttonBarContent() { return JBanner.buttonBarContentProperty.get(this); }
        set buttonBarContent(value) { JBanner.buttonBarContentProperty.set(this, value); }
        get type() { return JBanner.typeProperty.get(this); }
        set type(value) { JBanner.typeProperty.set(this, value); }
        _isOpenProperty_onChange(sender, args) {
            if (args.target === this) {
                if (args.newValue === true)
                    this._open();
                else
                    this._close();
            }
        }
        get isOpen() { return JBanner.isOpenProperty.get(this); }
        set isOpen(value) { JBanner.isOpenProperty.set(this, value); }
        get timeout() { return JBanner.timeoutProperty.get(this); }
        set timeout(value) { JBanner.timeoutProperty.set(this, value); }
    },
    _b.contentProperty = new FrameworkProperty("content", { defaultValue: "" }),
    _b.buttonBarContentProperty = new FrameworkProperty("buttonBarContent", { defaultValue: "" }),
    _b.typeProperty = new FrameworkProperty("type", { defaultValue: JBannerType.None }),
    _b.isOpenProperty = new FrameworkProperty("isOpen", { defaultValue: false }),
    _b.timeoutProperty = new FrameworkProperty("timeout", { defaultValue: 5 }),
    _b);
window.customElements.define("j-banner", JBanner);
/**
 * Progress Bar Widget Definition
 */
class JProgressBar extends Widget {
    constructor() {
        super();
        FrameworkEvent.attachMultiple(this._property_onChange.bind(this), JProgressBar.valueProperty.ChangeEvent, JProgressBar.minimumProperty.ChangeEvent, JProgressBar.maximumProperty.ChangeEvent, JProgressBar.isIndeterminateProperty.ChangeEvent);
        new PropertyAttributeBinding(this, JProgressBar.valueProperty, this, "value");
        new PropertyAttributeBinding(this, JProgressBar.maximumProperty, this, "maximum");
        new PropertyAttributeBinding(this, JProgressBar.minimumProperty, this, "minimum");
        new PropertyAttributeBinding(this, JProgressBar.isIndeterminateProperty, this, "indeterminate", { valueConverter: new BooleanAttributeValueConverter() });
    }
    _fillVisualTree(manager) {
        //Visual Tree
        this._progressBarFill = document.createElement("j-progress-bar-fill");
        manager.elements.add(this._progressBarFill);
        this._update();
    }
    _update() {
        if (this.isIndeterminate) {
            this._progressBarFill.style.width = "100%";
            this._progressBarFill.classList.add("indeterminate");
        }
        else {
            this._progressBarFill.style.width = this.valueInPercent + "%";
            this._progressBarFill.classList.remove("indeterminate");
        }
    }
    _property_onChange(sender, args) {
        if (args.target === this) {
            this._update();
            if (args.property === JProgressBar.valueProperty)
                this.isIndeterminate = false;
        }
    }
    get valueInPercent() {
        return (this.value - this.minimum) / (this.maximum - this.minimum) * 100;
    }
    get isIndeterminate() { return JProgressBar.isIndeterminateProperty.get(this); }
    set isIndeterminate(value) { JProgressBar.isIndeterminateProperty.set(this, value); }
    get value() { return JProgressBar.valueProperty.get(this); }
    set value(value) { JProgressBar.valueProperty.set(this, value); }
    get minimum() { return JProgressBar.minimumProperty.get(this); }
    set minimum(value) { JProgressBar.minimumProperty.set(this, value); }
    get maximum() { return JProgressBar.maximumProperty.get(this); }
    set maximum(value) { JProgressBar.maximumProperty.set(this, value); }
}
JProgressBar.isIndeterminateProperty = new FrameworkProperty("isIndeterminate", { defaultValue: true });
JProgressBar.valueProperty = new FrameworkProperty("value");
JProgressBar.minimumProperty = new FrameworkProperty("minimum", { defaultValue: 0 });
JProgressBar.maximumProperty = new FrameworkProperty("maximum", { defaultValue: 1 });
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
    get isDefault() { return JButton.isDefaultProperty.get(this); }
    set isDefault(value) { return JButton.isDefaultProperty.set(this, value); }
    get value() { return JButton.valueProperty.get(this); }
    set value(value) { return JButton.valueProperty.set(this, value); }
    get content() { return JButton.contentProperty.get(this); }
    set content(value) { return JButton.contentProperty.set(this, value); }
    get icon() { return JButton.iconProperty.get(this); }
    set icon(value) { return JButton.iconProperty.set(this, value); }
}
//Framework Properties
JButton.isDefaultProperty = new FrameworkProperty("isDefault", { defaultValue: false });
JButton.valueProperty = new FrameworkProperty("value", { defaultValue: null });
JButton.contentProperty = new FrameworkProperty("content", { defaultValue: null });
JButton.iconProperty = new FrameworkProperty("icon", { defaultValue: null });
/*
 * Button Bar Widget Definition
 */
const DEFAULT_BUTTON_DATA = {
    text: "",
    value: null,
    isDefault: false
};
class JButtonBar extends Widget {
    constructor() {
        super();
        this.SubmitEvent = new FrameworkCustomEvent(this, "submit");
        JButtonBar.buttonsProperty.ChangeEvent.attach(this._buttonsProperty_onChange, this);
    }
    _fillVisualTree(manager) {
        super._fillVisualTree();
        //Visual tree
        this._layoutPanel = document.createElement("j-wrap-panel");
        manager.elements.add(this._layoutPanel);
    }
    _addButton(data, position) {
        data = Object.assign({}, DEFAULT_BUTTON_DATA, data);
        //Create and initialize button
        let button = document.createElement("j-button");
        button.innerText = data.text;
        button.value = data.value;
        if (data.isDefault)
            button.focus();
        //Insert button to the appropriate container
        domUtils.insertElementAt(this._layoutPanel, position, button);
        let self = this;
        button.onclick = function () {
            self._invokeOnSubmit(this.value);
        };
    }
    _removeButton(position) {
        //Retrieve button element
        let button = this._layoutPanel.children[position];
        button.remove();
    }
    _updateButton(position) {
    }
    _updateButtons(oldButtons, newButtons) {
        arrayUtils.detectArrayChanges(oldButtons, newButtons, (newItem, newIndex) => {
            this._addButton(newItem, newIndex);
        }, (oldItem, oldIndex) => {
            this._removeButton(oldItem);
        }, (oldItem, newItem, index) => {
            this._updateButton(oldItem);
        });
    }
    _buttonsProperty_onChange(sender, args) {
        if (args.target === this) {
            this._updateButtons(args.oldValue, args.newValue);
        }
    }
    get buttons() { return JButtonBar.buttonsProperty.get(this); }
    set buttons(value) { JButtonBar.buttonsProperty.set(this, value); }
    _invokeOnSubmit(value) {
        this.SubmitEvent.invoke({ value: value });
    }
}
JButtonBar.buttonsProperty = new FrameworkProperty("buttons", { defaultValue: [] });
window.customElements.define("j-button-bar", JButtonBar);
export let DialogManager = class DialogManager {
    constructor() {
        this._openDialogs = new Collection();
    }
    showModal(options) {
        return new Promise((resolve, reject) => {
            let dialog = document.createElement("j-dialog");
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
            function dialog_onClose() {
                resolve();
            }
            dialog.closeEvent.attach(dialog_onClose);
            this._openDialogs.add(dialog);
        });
    }
};
export let dialogManager = new DialogManager();
window.dialogManager = dialogManager;
const DEFAULT_DIALOG_OPTIONS = {
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
        this.openEvent = new FrameworkCustomEvent(this, "open");
        this.closeEvent = new FrameworkCustomEvent(this, "close");
        JDialog.titleProperty.ChangeEvent.attach(this._titleProperty_onChange, this);
        JDialog.contentProperty.ChangeEvent.attach(this._contentProperty_onChange, this);
        JDialog.isOpenProperty.ChangeEvent.attach(this._isOpenProperty_onChange, this);
        new PropertyAttributeBinding(this, JDialog.isOpenProperty, this, "open", { valueConverter: new BooleanAttributeValueConverter() });
        new PropertyAttributeBinding(this, JDialog.optionsProperty, this, "options", { valueConverter: new JSONAttributeValueConverter() });
        new PropertyAttributeBinding(this, JDialog.buttonsProperty, this, "buttons", { valueConverter: new JSONAttributeValueConverter() });
        new PropertyBinding(this, JDialog.buttonsProperty, this._buttonBar, JButtonBar.buttonsProperty);
    }
    _fillVisualTree(manager) {
        super._fillVisualTree();
        let self = this;
        //Events
        function closeButtonClick() {
            self.close();
        }
        //Visual Template
        this._layoutCenterPanel = document.createElement("j-center-panel");
        manager.elements.add(this._layoutCenterPanel);
        this._dialogWindow = document.createElement("j-dialog-window");
        this._layoutCenterPanel.appendChild(this._dialogWindow);
        this._dialogWindowLayoutPanel = document.createElement("j-stack-panel");
        this._dialogWindow.appendChild(this._dialogWindowLayoutPanel);
        this._titleBar = document.createElement("j-dialog-title-bar");
        this._dialogWindowLayoutPanel.appendChild(this._titleBar);
        this._titleBarLayoutPanel = document.createElement("j-wrap-panel");
        this._titleBar.appendChild(this._titleBarLayoutPanel);
        this._titleSpan = document.createElement("span");
        this._titleBarLayoutPanel.appendChild(this._titleSpan);
        this._closeButton = document.createElement("j-button");
        this._titleBarLayoutPanel.appendChild(this._closeButton);
        this._closeButton.textContent = "X";
        this._closeButton.classList.add("close-button");
        this._closeButton.onclick = closeButtonClick;
        this._contentWrapper = document.createElement("j-dialog-content-wrapper");
        this._dialogWindowLayoutPanel.appendChild(this._contentWrapper);
        this._buttonBar = document.createElement("j-button-bar");
        this._dialogWindowLayoutPanel.appendChild(this._buttonBar);
        this._buttonBar.SubmitEvent.attach(this._buttonBar_onSubmit, this);
    }
    _buttonBar_onSubmit(args) {
        this._submit();
    }
    _open() {
        this.openEvent.invoke();
    }
    _close() {
        this.closeEvent.invoke();
    }
    open() {
        this.isOpen = true;
    }
    close() {
        this.isOpen = false;
    }
    updateOptions() {
        let options = Object.assign({}, DEFAULT_DIALOG_OPTIONS, this.options);
        this._titleBar.hidden = !options.showTitleBar;
        this._buttonBar.hidden = !options.showButtonBar;
        this._closeButton.hidden = !options.showCloseButton;
    }
    _titleProperty_onChange(sender, args) {
        if (args.target === this) {
            this._titleSpan.innerText = args.newValue;
        }
    }
    get title() { return JDialog.titleProperty.get(this); }
    set title(value) { JDialog.titleProperty.set(this, value); }
    _contentProperty_onChange(sender, args) {
        if (args.target === this) {
            this._contentWrapper.innerHTML = args.newValue;
        }
    }
    get content() { return JDialog.contentProperty.get(this); }
    set content(value) { JDialog.contentProperty.set(this, value); }
    get buttons() { return JDialog.buttonsProperty.get(this); }
    set buttons(value) { JDialog.buttonsProperty.set(this, value); }
    _isOpenProperty_onChange(sender, args) {
        if (args.target === this) {
            if (args.value === true)
                this._open();
            else
                this._close();
        }
    }
    get isOpen() { return JDialog.isOpenProperty.get(this); }
    set isOpen(value) { JDialog.isOpenProperty.set(this, value); }
    get options() { return JDialog.optionsProperty.get(this); }
    set options(value) { JDialog.optionsProperty.set(this, value); }
}
JDialog.titleProperty = new FrameworkProperty("title", { defaultValue: "" });
JDialog.contentProperty = new FrameworkProperty("content", { defaultValue: "" });
JDialog.buttonsProperty = new FrameworkProperty("buttons", { defaultValue: [] });
JDialog.isOpenProperty = new FrameworkProperty("isOpen", { defaultValue: false });
JDialog.optionsProperty = new FrameworkProperty("options");
window.customElements.define("j-dialog", JDialog);
/*Board Widget*/
class JBoard extends Widget {
    constructor() {
        super();
        this.cardDropEvent = new FrameworkCustomEvent(this, "carddrop");
        this.ondragover = this._dragover_handler;
        this.ondrop = this._drop_handler;
        this.ondragleave = this._dragleave_handler;
        new PropertyAttributeBinding(this, JBoard.contextProperty, this, "context", { valueConverter: new FlagsAttributeValueConverter() });
        new PropertyAttributeBinding(this, JBoard.dataProperty, this, "data", { valueConverter: new JSONAttributeValueConverter() });
        new PropertyAttributeBinding(this, JBoard.acceptsDropProperty, this, "acceptsDrop", { valueConverter: new BooleanAttributeValueConverter() });
    }
    _invokeCardDrop(cardData, boardData, context) {
        this.cardDropEvent.invoke({
            cardData: cardData,
            boardData: boardData,
            context: context
        });
    }
    _onDragEnter(sender, args) {
        let { acceptDrop } = args;
        let sourceContextStr = args.getContext();
        if (!sourceContextStr)
            return;
        let sourceContext = ContextSelectionFlags.parse(sourceContextStr);
        if (!this.acceptsDrop ||
            !this.context.matches(sourceContext))
            return;
        acceptDrop();
    }
    _onDragOver(sender, args) {
        this._applyDragOverVisualStyle();
    }
    _onDragLeave(sender, args) {
        this._removeDragOverVisualStyle();
    }
    _canAcceptDrop(data) {
        if (data === null)
            return false;
        if (data.type !== "card")
            return false;
        return true;
    }
    _onDragDrop(sender, args) {
        let { getData } = args;
        let data = getData();
        if (this._canAcceptDrop(data))
            this._invokeCardDrop(data.cardData, this.data, this.context);
        this._removeDragOverVisualStyle();
    }
    _applyDragOverVisualStyle() { this.classList.add("drag-over"); }
    _removeDragOverVisualStyle() { this.classList.remove("drag-over"); }
    get context() { return JBoard.contextProperty.get(this); }
    set context(value) { JBoard.contextProperty.set(this, value); }
    get data() { return JBoard.dataProperty.get(this); }
    set data(value) { JBoard.dataProperty.set(this, value); }
    get acceptsDrop() { return JBoard.acceptsDropProperty.get(this); }
    set acceptsDrop(value) { JBoard.acceptsDropProperty.set(this, value); }
}
JBoard.contextProperty = new FrameworkProperty("context", { defaultValue: ContextSelectionFlags.all });
JBoard.dataProperty = new FrameworkProperty("data", { defaultValue: null });
JBoard.acceptsDropProperty = new FrameworkProperty("acceptsDrop", { defaultValue: true });
customElements.define("j-board", JBoard);
/*Card Widget*/
class JCard extends Widget {
    constructor() {
        super();
        new PropertyAttributeBinding(this, JCard.contextProperty, this, "context", { valueConverter: new FlagsAttributeValueConverter() });
        new PropertyAttributeBinding(this, JCard.dataProperty, this, "data", { valueConverter: new JSONAttributeValueConverter() });
    }
    _fillVisualTree(manager) {
        super._fillVisualTree();
        //Visual Tree
        this._fieldsStackPanel = document.createElement("j-stack-panel");
        this.appendChild(this._fieldsStackPanel);
    }
    _applyDragVisualStyle() {
        this.classList.add("dragging");
    }
    _onDragStart(sender, args) {
        let data = {
            type: "card",
            cardData: this.data
        };
        args.setData(data);
        let contextStr = this.context.toString();
        args.setContext(contextStr);
        this._applyDragVisualStyle();
    }
    _removeDragVisualStyle() {
        this.classList.remove("dragging");
    }
    _onDragEnd(sender, args) {
        this._removeDragVisualStyle();
    }
    _onDragCancel(sender, args) {
        this._removeDragVisualStyle();
    }
    get context() { return JCard.contextProperty.get(this); }
    set context(value) { JCard.contextProperty.set(this, value); }
    get data() { return JCard.dataProperty.get(this); }
    set data(value) { JCard.dataProperty.set(this, value); }
}
JCard.contextProperty = new FrameworkProperty("context", { defaultValue: ContextSelectionFlags.all });
JCard.dataProperty = new FrameworkProperty("data", { defaultValue: null });
window.customElements.define("j-card", JCard);
/*Editable Label Widget*/
class JEditableLabel extends Widget {
    constructor() {
        super();
        this._cachedText = "";
        this.startEditEvent = new FrameworkCustomEvent(this, "startedit");
        this.endEditEvent = new FrameworkCustomEvent(this, "endedit");
        this.confirmEditEvent = new FrameworkCustomEvent(this, "confirmedit");
        this.cancelEditEvent = new FrameworkCustomEvent(this, "canceledit");
        this.ondblclick = this._dblclick_handler;
        this.onblur = this._blur_handler;
        this.onkeydown = this._keydown_handler;
        JEditableLabel.isEditingProperty.ChangeEvent.attach(this._isEditing_onChange, this);
        new PropertyAttributeBinding(this, JEditableLabel.isEditingProperty, this, "editing", { valueConverter: new BooleanAttributeValueConverter() });
    }
    _invokeStartEdit() {
        this.startEditEvent.invoke();
    }
    _invokeEndEdit(text, canceled) {
        this.endEditEvent.invoke({
            text: text,
            canceled: canceled
        });
    }
    _invokeConfirmEdit(text) {
        this.confirmEditEvent.invoke({
            text: text
        });
    }
    _invokeCancelEdit(text) {
        this.cancelEditEvent.invoke({
            text: text
        });
    }
    _openEditing() {
        this._cachedText = this.textContent;
        this.contentEditable = true;
        Utils.selectAllText(this);
        this.focus();
        this.startEditEvent.invoke();
    }
    _closeEditing() {
        this.contentEditable = false;
        Utils.deselectAllText();
    }
    _applyAndClose() {
        let text = this.textContent;
        this.closeEditing();
        this._invokeConfirmEdit(text);
        this._invokeEndEdit(text, false);
    }
    _discardAndClose() {
        this.textContent = this._cachedText;
        this.closeEditing();
        this._invokeCancelEdit(this.textContent);
        this._invokeEndEdit(this.textContent, true);
    }
    _dblclick_handler(ev) {
        const MOUSE_LEFT_BUTTON = 1;
        if (ev.button !== MOUSE_LEFT_BUTTON)
            this.openEditing();
    }
    _blur_handler() {
        this._discardAndClose();
    }
    _keydown_handler(ev) {
        if (ev.key === "Escape")
            this._discardAndClose();
        else if (ev.key === "Enter")
            this._applyAndClose();
    }
    openEditing() { this.isEditing = true; }
    closeEditing() { this.isEditing = false; }
    _isEditing_onChange(sender, args) {
        if (args.target === this) {
            if (args.newValue)
                this._openEditing();
            else
                this._closeEditing();
        }
    }
    get isEditing() { return JEditableLabel.isEditingProperty.get(this); }
    set isEditing(value) { JEditableLabel.isEditingProperty.set(this, value); }
}
JEditableLabel.isEditingProperty = new FrameworkProperty("isEditing", { defaultValue: false });
customElements.define("j-editable-label", JEditableLabel);
/*Spinner Widget*/
class JSpinner extends Widget {
    constructor() {
        super(...arguments);
        this.isOpen = false;
    }
    _fillVisualTree(manager) {
        super._fillVisualTree();
        let layoutCenterPanel = document.createElement("j-center-panel");
        manager.elements.add(layoutCenterPanel);
        let spinnerImage = new Image(80, 80);
        spinnerImage.src = "styles/images/loader.svg";
        layoutCenterPanel.appendChild(spinnerImage);
        this._layoutCenterPanel = layoutCenterPanel;
        this._spinnerImage = spinnerImage;
    }
    open() {
        this.isOpen = true;
    }
    close() {
        this.isOpen = false;
    }
    get isOpen() { return JBanner.isOpenProperty.get(this); }
    set isOpen(value) { JBanner.isOpenProperty.set(this, value); }
}
JSpinner.isOpenProperty = new FrameworkProperty("isOpen");
customElements.define("j-spinner", JSpinner);
