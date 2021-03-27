import { Interface, InterfaceField } from "../../standard/interfaces/index.js";
import { Type } from "../../standard/reflection/index.js";
import { IAjaxHeaders } from "./i-ajax-headers.js";

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
