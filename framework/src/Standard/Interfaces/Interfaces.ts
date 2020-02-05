import { Enumeration } from "../index";

export const InterfaceDifferenceKind = Enumeration.create([
    "None",
    "Missing",
    "Invalid",
    "MissingAttributes",
    "IncorrectType"
]);

export type InterfaceMemberKey = string | number | symbol;

export const InterfaceMemberType = Enumeration.create([
    "Property",
    "Function"
]);