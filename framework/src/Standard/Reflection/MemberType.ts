import { Enumeration } from "../Enumeration.js";

export const MemberType = Enumeration.create({
    Type: 1,
    Property: 2,
    Function: 4,
    Field: 8,
    Instance: 16,
    Static: 32
});
