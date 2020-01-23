import { Interface, InterfaceMember, InterfaceMemberType } from "../../Standard/Interfaces/index";

export interface IValueValidator {
    validate?: (value: any) => boolean
}

/**
 * ValueValidator Interface 
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export const IValueValidator = new Interface(
    new InterfaceMember("validate", InterfaceMemberType.Function)
);