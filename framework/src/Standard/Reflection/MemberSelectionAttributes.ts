import { Enumeration } from "../Enumeration.js";

export const MemberSelectionAttributes = Enumeration.create({
    Any: 0,
    Configurable: 1,
    Enumerable: 2,
    Writable: 4,
});
