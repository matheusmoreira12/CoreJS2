import { Interface, InterfaceFunction } from "../../standard/interfaces/index.js";

/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between inner data types and the interface.*/
export const IValueConverter = new Interface(
    new InterfaceFunction("convert"),
    new InterfaceFunction("convertBack")
);

/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between inner data types and the interface.*/
export interface IValueConverter {
    convert: (value: any) => string | null,
    convertBack: (value: string | null) => any
}