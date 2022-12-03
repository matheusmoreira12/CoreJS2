import { Enumeration } from "../enumerations/enumeration.js";

export const MemberKind = Enumeration.create({
    Constructor: 0b001,
    Method: 0b010,
    Property: 0b100
});