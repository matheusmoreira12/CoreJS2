import { ArgumentTypeException, FrameworkException } from "./exceptions.js";
import { Enumeration } from "./Enumeration.js";
import { BroadcastFrameworkEvent } from "./Events.js";
import { Interface, InterfaceMember, InterfaceMemberType } from "./Interfaces/Interface.js";

/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between layers of abstraction.*/
export const IValueConverter = new Interface(
    new InterfaceMember("convert", InterfaceMemberType.Function),
    new InterfaceMember("convertBack", InterfaceMemberType.Function)
);

export interface ValueConverter {
    convert: (value: any) => string | null,
    convertBack: (value: string) => any
}

/**
 * ValueValidator Interface 
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export const IValueValidator = new Interface(
    new InterfaceMember("validate", InterfaceMemberType.Function)
);