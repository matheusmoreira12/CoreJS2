import { FrameworkEvent } from "../Standard/Events";
/**
 *
 */
export default class DragEmulator {
    constructor(handler: any);
    createPreviewElem(args: any): void;
    repositionPreviewElem(args: any): void;
    removePreviewElement(): void;
    onDragStart(sender: any, args: any): void;
    onDragMove(_sender: any, args: any): void;
    onDragEnd(_sender: any, _args: any): void;
    onDragCancel(_sender: any, _args: any): void;
    DragStartEvent: FrameworkEvent;
    DragMoveEvent: FrameworkEvent;
    DragEndEvent: FrameworkEvent;
    DragCancelEvent: FrameworkEvent;
    private __initialLeft;
    private __initialTop;
    private __initialClientX;
    private __initialClientY;
    private __previewElem;
    private __handler;
}
