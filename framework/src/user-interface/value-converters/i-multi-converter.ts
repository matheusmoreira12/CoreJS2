import { Interface, InterfaceFunction } from "../../standard/interfaces/index.js";

/**
 * IMultiConverter Interface
 * Exposes a friendly interface for converting multiple values between inner data types and the interface.*/
export const IMultiConverter = new Interface(
    new InterfaceFunction("convert"),
    new InterfaceFunction("convertBack")
);

/**
 * IMultiConverter Interface
 * Exposes a friendly interface for converting multiple values between inner data types and the interface.*/
export interface IMultiConverter {
    convert: (value: any[]) => any,
    convertBack: (value: any) => any[]
}