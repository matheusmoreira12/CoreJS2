import { Interface, InterfaceMember, InterfaceMemberType } from "../../Standard/Interfaces/index.js";
import { Attributes, Type } from "../../Standard/Reflection/index.js";
import { IAjaxHeaders } from "./IAjaxHeaders.js";

export const IAjaxOptions = new Interface(
    new InterfaceMember("mimeType", InterfaceMemberType.Field, Type.get(String), Attributes.Enumerable, true),
    new InterfaceMember("responseType", InterfaceMemberType.Field, Type.get(Number), Attributes.Enumerable, true),
    new InterfaceMember("body", InterfaceMemberType.Field, null, Attributes.Enumerable, true),
    new InterfaceMember("headers", InterfaceMemberType.Field, Type.get(Object), Attributes.Enumerable, true)
);

export interface IAjaxOptions {
    mimeType?: string;
    responseType?: number;
    body?: BodyInit;
    headers?: IAjaxHeaders;
};
