import { Enumeration } from "../index.js";

export const MemberSelectionOptions = Enumeration.create({
    Constructor: 0b000001,
    Methods: 0b000010,
    Properties: 0b000100,
    Any: 0b001111,
    StaticOnly: 0b010000,
    InstanceOnly: 0b100000,
});