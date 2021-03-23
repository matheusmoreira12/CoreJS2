import { Enumeration } from "../index.js";

export const InterfaceDifferenceKind = Enumeration.create({
    None: null,
    Missing: null,
    Invalid: null,
    InvalidFieldType: null
});

export type InterfaceMemberKey = string | number | symbol;