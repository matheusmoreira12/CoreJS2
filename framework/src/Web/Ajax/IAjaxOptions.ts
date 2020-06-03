import { Interface, InterfaceMember, InterfaceMemberType } from "../../Standard/Interfaces/index.js";
import { MemberAttributes, Type } from "../../Standard/Types/index.js";
import { IAjaxHeaders } from "./IAjaxHeaders.js";

export const IAjaxOptions = new Interface(
    new InterfaceMember("mimeType", InterfaceMemberType.Field, Type.get(String), MemberAttributes.Enumerable, true),
    new InterfaceMember("responseType", InterfaceMemberType.Field, Type.get(Number), MemberAttributes.Enumerable, true),
    new InterfaceMember("body", InterfaceMemberType.Field, null, MemberAttributes.Enumerable, true),
    new InterfaceMember("headers", InterfaceMemberType.Field, Type.get(Object), MemberAttributes.Enumerable, true)
);

export interface IAjaxOptions {
    mimeType?: string;
    responseType?: number;
    body?: BodyInit;
    headers?: IAjaxHeaders;
};
