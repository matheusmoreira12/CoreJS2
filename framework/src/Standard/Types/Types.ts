import { Enumeration } from "../Enumeration";

export type Class<T> = new(...args: any) => T;

export const MemberSelectionAttributes = Enumeration.create({
    Any: 0,
    Configurable: 1,
    Enumerable: 2,
    Writable: 4,
});

export const MemberSelectionType = Enumeration.create({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16,
    Any: 31,
});

export const MemberAttributes = Enumeration.create({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4
});

export const MemberType = Enumeration.create({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16
});