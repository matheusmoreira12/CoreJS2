import { Interface, InterfaceMember, InterfaceMemberType } from "../../Standard/Interfaces/index.js";
import { Type } from "../../Standard/Reflection/index.js";
import { IAjaxHeaders } from "./IAjaxHeaders.js";

export const IAjaxOptions = new Interface(
    new InterfaceMember("mimeType", InterfaceMemberType.Field, Type.get(String), true),
    new InterfaceMember("responseType", InterfaceMemberType.Field, Type.get(Number), true),
    new InterfaceMember("body", InterfaceMemberType.Field, null, true),
    new InterfaceMember("headers", InterfaceMemberType.Field, Type.get(Object), true)
);

export interface IAjaxOptions {
    mimeType?: string;
    responseType?: number;
    body?: BodyInit;
    headers?: IAjaxHeaders;
};
