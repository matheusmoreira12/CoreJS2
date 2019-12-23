import { ArgumentTypeException } from "../Standard/Exceptions";
import { FrameworkEvent } from "../Standard/Events";
import DragDropHandler from "./DragDropHandler";
/**
 *
 */
export default class DragEmulator {
    constructor(handler) {
        this.DragStartEvent = new FrameworkEvent(this.onDragStart, this);
        this.DragMoveEvent = new FrameworkEvent(this.onDragMove, this);
        this.DragEndEvent = new FrameworkEvent(this.onDragEnd, this);
        this.DragCancelEvent = new FrameworkEvent(this.onDragCancel, this);
        this.__previewElem = null;
        if (!(handler instanceof DragDropHandler))
            throw new ArgumentTypeException("handler", handler, DragDropHandler);
        handler.DragStartEvent.attach(this.DragStartEvent);
        handler.DragMoveEvent.attach(this.DragMoveEvent);
        handler.DragEndEvent.attach(this.DragEndEvent);
        handler.DragCancelEvent.attach(this.DragCancelEvent);
        this.__handler = handler;
    }
    createPreviewElem(args) {
        let targetElem = this.__handler.target;
        let previewElem = targetElem.cloneNode(true);
        this.__previewElem = previewElem;
        previewElem.style.position = "absolute";
        previewElem.style.opacity = ".6";
        previewElem.style.zIndex = "9999";
        document.body.appendChild(previewElem);
        this.repositionPreviewElem(args);
    }
    repositionPreviewElem(args) {
        const previewElem = this.__previewElem;
        if (!previewElem)
            return;
        let { left, top } = args;
        previewElem.style.left = `${left}px`;
        previewElem.style.top = `${top}px`;
    }
    removePreviewElement() {
        const previewElem = this.__previewElem;
        if (!previewElem)
            return;
        previewElem.remove();
        this.__previewElem = null;
    }
    onDragStart(sender, args) {
        let targetElem = this.__handler.target;
        let { clientX, clientY } = args;
        let { left, top } = targetElem.getBoundingClientRect();
        this.createPreviewElem({
            left, top
        });
        this.__initialLeft = left;
        this.__initialTop = top;
        this.__initialClientX = clientX;
        this.__initialClientY = clientY;
    }
    onDragMove(_sender, args) {
        let { clientX, clientY } = args;
        let left = this.__initialLeft + clientX - this.__initialClientX;
        let top = this.__initialTop + clientY - this.__initialClientY;
        this.repositionPreviewElem({
            left,
            top
        });
    }
    onDragEnd(_sender, _args) {
        this.removePreviewElement();
    }
    onDragCancel(_sender, _args) {
        this.removePreviewElement();
    }
}
