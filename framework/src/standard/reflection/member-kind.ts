import { Enumeration } from "../enumerations/enumeration.js";

export const MemberKind = Enumeration.create({
    Constructor: 0b0001,
    Method: 0b0010,
    Property: 0b0100,
    Parameter: 0b1000
});