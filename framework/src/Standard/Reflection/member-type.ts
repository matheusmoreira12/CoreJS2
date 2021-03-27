import { Enumeration } from "../enumeration.js";

export const MemberType = Enumeration.create({
    Constructor: 0b000001,
    Function: 0b000010,
    Property: 0b000100,
    Field: 0b001000,
    Type: 0b010000,
    Parameter: 0b100000
});