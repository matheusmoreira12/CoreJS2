import { AjaxAbortEventHandler, AjaxErrorEventHandler, AjaxLoadEventHandler, AjaxLoadEndEventHandler, AjaxLoadStartEventHandler, AjaxProgressEventHandler, AjaxReadyStateChangeEventHandler, AjaxTimeoutEventHandler } from "./Ajax.js";
import { Interface, InterfaceMember, InterfaceMemberType } from "../Standard/Interfaces/index.js";
import { MemberAttributes } from "../Standard/Types/Types.js";

export const IAjaxCallbacks = new Interface(
    new InterfaceMember("onabort", InterfaceMemberType.Function, null, MemberAttributes.Enumerable, true),
    new InterfaceMember("onerror", InterfaceMemberType.Function, null, MemberAttributes.Enumerable, true),
    new InterfaceMember("onload", InterfaceMemberType.Function, null, MemberAttributes.Enumerable, true),
    new InterfaceMember("onloadend", InterfaceMemberType.Function, null, MemberAttributes.Enumerable, true),
    new InterfaceMember("onloadstart", InterfaceMemberType.Function, null, MemberAttributes.Enumerable, true),
    new InterfaceMember("onprogress", InterfaceMemberType.Function, null, MemberAttributes.Enumerable, true),
    new InterfaceMember("onreadystatechange", InterfaceMemberType.Function, null, MemberAttributes.Enumerable, true),
    new InterfaceMember("ontimeout", InterfaceMemberType.Function, null, MemberAttributes.Enumerable, true)
);

export interface IAjaxCallbacks {
    onabort?: AjaxAbortEventHandler;
    onerror?: AjaxErrorEventHandler;
    onload?: AjaxLoadEventHandler;
    onloadend?: AjaxLoadEndEventHandler;
    onloadstart?: AjaxLoadStartEventHandler;
    onprogress?: AjaxProgressEventHandler;
    onreadystatechange?: AjaxReadyStateChangeEventHandler;
    ontimeout?: AjaxTimeoutEventHandler;
};
