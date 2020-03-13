import { Enumeration } from "../Enumeration";

export type Constructor<T extends Object> = Function | T["constructor"] | (new () => T);

export type Class<T extends Object> = {
    prototype: T,
    constructor: Constructor<T>
} & Constructor<T>;

export type Instance<TClass extends Class<Object>> = Object & TClass["prototype"];

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