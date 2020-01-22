import { Interface } from "../../Standard/Interfaces/index.js";
/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between inner data types and the interface.*/
export declare const IValueConverter: Interface;
/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between inner data types and the interface.*/
export interface IValueConverter {
    convert: (value: any) => string | null;
    convertBack: (value: string) => any;
}
