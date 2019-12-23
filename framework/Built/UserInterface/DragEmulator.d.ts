/**
 *
 */
declare class DragEmulator {
    constructor(handler: any);
    createPreviewElem(args: any): void;
    repositionPreviewElem(args: any): void;
    removePreviewElement(): void;
    onDragStart(sender: any, args: any): void;
    onDragMove(sender: any, args: any): void;
    onDragEnd(sender: any, args: any): void;
    onDragCancel(sender: any, args: any): void;
    DragStartEvent: any;
    DragMoveEvent: any;
    DragEndEvent: any;
    DragCancelEvent: any;
    previewElem: any;
}
