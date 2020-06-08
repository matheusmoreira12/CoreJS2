import { Enumeration } from "../Enumeration.js";

export const MemberSelectionType = Enumeration.create({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16,
    Any: 31,
});
