import { Interface, InterfaceMember, InterfaceMemberType } from "./Interfaces/Interface.js";


/**
 * ValueValidator Interface 
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export const IValueValidator = new Interface(
    new InterfaceMember("validate", InterfaceMemberType.Function)
);