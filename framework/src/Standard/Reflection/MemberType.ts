import { Enumeration } from "../Enumeration.js";

export const MemberType = Enumeration.create({
    Instance: 0b0000001,
    Static: 0b0000010,
    Constructor: 0b0000100,
    Function: 0b0001000,
    Property: 0b0010000,
    Field: 0b0100000,
    Type: 0b1000000
});
