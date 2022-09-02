import { AjaxHeaders } from "./ajax-headers";

export type AjaxOptions = {
    mimeType?: string;
    responseType?: number;
    body?: BodyInit;
    headers?: AjaxHeaders;
};
