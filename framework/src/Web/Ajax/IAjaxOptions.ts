import { Interface, InterfaceField } from "../../Standard/Interfaces/index.js";
import { Type } from "../../Standard/Reflection/index.js";
import { IAjaxHeaders } from "./IAjaxHeaders.js";

export const IAjaxOptions = new Interface(
    new InterfaceField("mimeType", Type.get(String)),
    new InterfaceField("responseType", Type.get(Number)),
    new InterfaceField("body", null),
    new InterfaceField("headers", Type.get(Object))
);

export interface IAjaxOptions {
    mimeType?: string;
    responseType?: number;
    body?: BodyInit;
    headers?: IAjaxHeaders;
};
