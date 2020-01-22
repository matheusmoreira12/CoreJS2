import { FrameworkEvent } from "../Standard/Events/index.js";
import { DragDropHandler } from "./index.js";
/**
 *
 */
export default class DragEmulator {
    constructor(handler: DragDropHandler);
    createPreviewElem(args: any): void;
    repositionPreviewElem(args: any): void;
    removePreviewElement(): void;
    onDragStart(sender: any, args: any): void;
    onDragMove(_sender: any, args: any): void;
    onDragEnd(_sender: any, _args: any): void;
    onDragCancel(_sender: any, _args: any): void;
    DragStartEvent: FrameworkEvent<any>;
    DragMoveEvent: FrameworkEvent<any>;
    DragEndEvent: FrameworkEvent<any>;
    DragCancelEvent: FrameworkEvent<any>;
    private __initialLeft;
    private __initialTop;
    private __initialClientX;
    private __initialClientY;
    private __previewElem;
    private __handler;
}
