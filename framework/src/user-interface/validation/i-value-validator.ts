import { Interface, InterfaceFunction } from "../../standard/interfaces/index.js";

export interface IValueValidator {
    validate?: (value: any) => boolean
}

/**
 * ValueValidator Interface 
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export const IValueValidator = new Interface(
    new InterfaceFunction("validate")
);