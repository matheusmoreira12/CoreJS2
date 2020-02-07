import { Enumeration } from "../index";

export const InterfaceDifferenceKind = Enumeration.create({
    None: null,
    Missing: null,
    Invalid: null,
    MissingAttributes: null,
    IncorrectTyp: null
});

export type InterfaceMemberKey = string | number | symbol;

export const InterfaceMemberType = Enumeration.create({
    Property: null,
    Functio: null
});