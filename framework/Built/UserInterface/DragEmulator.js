/**
 *
 */
class DragEmulator {
    constructor(handler) {
        this.DragStartEvent = new FrameworkEvent(this.onDragStart.bind(this));
        this.DragMoveEvent = new FrameworkEvent(this.onDragMove.bind(this));
        this.DragEndEvent = new FrameworkEvent(this.onDragEnd.bind(this));
        this.DragCancelEvent = new FrameworkEvent(this.onDragCancel.bind(this));
        this.previewElem = null;
        if (!handler instanceof DragDropHandler)
            throw new ArgumentTypeException("handler", handler, DragDropHandler);
        handler.DragStartEvent.attach(this.DragStartEvent);
        handler.DragMoveEvent.attach(this.DragMoveEvent);
        handler.DragEndEvent.attach(this.DragEndEvent);
        handler.DragCancelEvent.attach(this.DragCancelEvent);
        this.handler = handler;
    }
    createPreviewElem(args) {
        let targetElem = this.handler.target;
        let previewElem = targetElem.cloneNode(true);
        previewElem.style.position = "absolute";
        previewElem.style.opacity = ".6";
        previewElem.style.zIndex = "9999";
        document.body.appendChild(previewElem);
        this.previewElem = previewElem;
        this.repositionPreviewElem(args);
    }
    repositionPreviewElem(args) {
        const previewElem = this.previewElem;
        if (!previewElem)
            return;
        let { left, top } = args;
        previewElem.style.left = `${left}px`;
        previewElem.style.top = `${top}px`;
    }
    removePreviewElement() {
        const previewElem = this.previewElem;
        if (!previewElem)
            return;
        previewElem.remove();
        this.previewElem = null;
    }
    onDragStart(sender, args) {
        let targetElem = this.handler.target;
        let { clientX, clientY } = args;
        let { left, top } = targetElem.getBoundingClientRect();
        this.createPreviewElem({
            left, top
        });
        this.initialLeft = left;
        this.initialTop = top;
        this.initialClientX = clientX;
        this.initialClientY = clientY;
    }
    onDragMove(sender, args) {
        let { clientX, clientY } = args;
        let left = this.initialLeft + clientX - this.initialClientX;
        let top = this.initialTop + clientY - this.initialClientY;
        this.repositionPreviewElem({
            left,
            top
        });
    }
    onDragEnd(sender, args) {
        this.removePreviewElement();
    }
    onDragCancel(sender, args) {
        this.removePreviewElement();
    }
}
