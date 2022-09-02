import { FrameworkEventListener } from "../../standard/events/index.js";
import { AjaxEventArgs } from "./index.js";

export interface AjaxCallbacks {
    onAbort?: FrameworkEventListener<AjaxEventArgs>;
    onError?: FrameworkEventListener<AjaxEventArgs>;
    onLoad?: FrameworkEventListener<AjaxEventArgs>;
    onLoadEnd?: FrameworkEventListener<AjaxEventArgs>;
    onLoadStart?: FrameworkEventListener<AjaxEventArgs>;
    onProgress?: FrameworkEventListener<AjaxEventArgs>;
    onReadyStateChange?: FrameworkEventListener<AjaxEventArgs>;
    onTimeout?: FrameworkEventListener<AjaxEventArgs>;
};
