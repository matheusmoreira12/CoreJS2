import { Enumeration } from "../index.js";

export const InterfaceDifferenceKind = new Enumeration([
    "None",
    "Missing",
    "Invalid",
    "MissingAttributes",
    "IncorrectType"
]);

export type InterfaceMemberKey = string | number | symbol;

export const InterfaceMemberType = new Enumeration([
    "Property",
    "Function"
]);