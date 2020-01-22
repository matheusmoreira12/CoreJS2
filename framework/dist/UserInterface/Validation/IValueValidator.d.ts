import { Interface } from "../../Standard/Interfaces/index.js";
export interface IValueValidator {
    validate?: (value: any) => boolean;
}
/**
 * ValueValidator Interface
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export declare const IValueValidator: Interface;
