import { Enumeration } from "../index.js";

export const InterfaceDifferenceKind = Enumeration.create({
    None: null,
    Missing: null,
    Invalid: null,
    MissingAttributes: null,
    IncorrectType: null
});

export type InterfaceMemberKey = string | number | symbol;

export const InterfaceMemberType = Enumeration.create({
    Field: null,
    Property: null,
    Function: null
});