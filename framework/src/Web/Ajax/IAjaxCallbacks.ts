import { Interface, InterfaceMember, InterfaceMemberType } from "../../Standard/Interfaces/index.js";
import { Attributes } from "../../Standard/Reflection/index.js";
import { FrameworkEventListener } from "../../Standard/Events/index.js";
import { AjaxEventArgs } from "./index.js";

export const IAjaxCallbacks = new Interface(
    new InterfaceMember("onabort", InterfaceMemberType.Function, null, Attributes.Enumerable, true),
    new InterfaceMember("onerror", InterfaceMemberType.Function, null, Attributes.Enumerable, true),
    new InterfaceMember("onload", InterfaceMemberType.Function, null, Attributes.Enumerable, true),
    new InterfaceMember("onloadend", InterfaceMemberType.Function, null, Attributes.Enumerable, true),
    new InterfaceMember("onloadstart", InterfaceMemberType.Function, null, Attributes.Enumerable, true),
    new InterfaceMember("onprogress", InterfaceMemberType.Function, null, Attributes.Enumerable, true),
    new InterfaceMember("onreadystatechange", InterfaceMemberType.Function, null, Attributes.Enumerable, true),
    new InterfaceMember("ontimeout", InterfaceMemberType.Function, null, Attributes.Enumerable, true)
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
