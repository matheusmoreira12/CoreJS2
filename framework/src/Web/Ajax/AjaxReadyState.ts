import { Enumeration } from "../../Standard/index.js";

export const AjaxReadyState = Enumeration.create({
    Unsent: 0,
    Opened: null,
    HeadersReceived: null,
    Loading: null,
    Done: null
});
