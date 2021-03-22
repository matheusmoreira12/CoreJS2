import { Enumeration } from "../index.js";

export const MemberSelectionOptions = Enumeration.create({
    StaticOnly: 0b000001,
    InstanceOnly: 0b000010,
    Constructor: 0b000100,
    Functions: 0b001000,
    Properties: 0b010000,
    Fields: 0b100000,
    Any: 0b111100,
});