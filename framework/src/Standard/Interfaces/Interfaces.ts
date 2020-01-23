import { Enumeration } from "../index";

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