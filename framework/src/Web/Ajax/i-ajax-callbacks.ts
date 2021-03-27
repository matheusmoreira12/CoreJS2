import { Interface, InterfaceFunction } from "../../standard/interfaces/index.js";
import { FrameworkEventListener } from "../../standard/events/index.js";
import { AjaxEventArgs } from "./index.js";

export const IAjaxCallbacks = new Interface(
    new InterfaceFunction("onabort"),
    new InterfaceFunction("onerror"),
    new InterfaceFunction("onload"),
    new InterfaceFunction("onloadend"),
    new InterfaceFunction("onloadstart"),
    new InterfaceFunction("onprogress"),
    new InterfaceFunction("onreadystatechange"),
    new InterfaceFunction("ontimeout")
);

export interface IAjaxCallbacks {
    onAbort?: FrameworkEventListener<AjaxEventArgs>;
    onError?: FrameworkEventListener<AjaxEventArgs>;
    onLoad?: FrameworkEventListener<AjaxEventArgs>;
    onLoadEnd?: FrameworkEventListener<AjaxEventArgs>;
    onLoadStart?: FrameworkEventListener<AjaxEventArgs>;
    onProgress?: FrameworkEventListener<AjaxEventArgs>;
    onReadyStateChange?: FrameworkEventListener<AjaxEventArgs>;
    onTimeout?: FrameworkEventListener<AjaxEventArgs>;
};
