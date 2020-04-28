import { AjaxResponseType } from "./Ajax.js";
import { Interface, InterfaceMember, InterfaceMemberType } from "../Standard/Interfaces/index.js";
import { MemberAttributes, Type } from "../Standard/Types/index.js";

export const IAjaxOptions = new Interface(
    new InterfaceMember("mimeType", InterfaceMemberType.Field | InterfaceMemberType.Property, Type.get(String), MemberAttributes.Enumerable, true),
    new InterfaceMember("responseType", InterfaceMemberType.Field | InterfaceMemberType.Property, Type.get(Number), MemberAttributes.Enumerable, true),
    new InterfaceMember("body", InterfaceMemberType.Field | InterfaceMemberType.Property, null, MemberAttributes.Enumerable, true),
);

export interface IAjaxOptions {
    mimeType?: string;
    responseType?: AjaxResponseType;
    body?: Document | BodyInit;
};
