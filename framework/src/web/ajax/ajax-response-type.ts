import { Enumeration } from "../../standard/index.js";

export const AjaxResponseType = Enumeration.create({
    Other: 0,
    Default: null,
    ArrayBuffer: null,
    Blob: null,
    Document: null,
    JSON: null,
    Text: null
});
