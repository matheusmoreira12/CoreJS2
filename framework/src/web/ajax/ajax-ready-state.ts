import { Enumeration } from "../../standard/index.js";

export const AjaxReadyState = Enumeration.create({
    Unsent: 0,
    Opened: null,
    HeadersReceived: null,
    Loading: null,
    Done: null
});
