import { Interface, InterfaceMemberType, InterfaceMember } from "../../Standard/Interfaces/index";

/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between inner data types and the interface.*/
export const IValueConverter = new Interface(
    new InterfaceMember("convert", InterfaceMemberType.Function),
    new InterfaceMember("convertBack", InterfaceMemberType.Function)
);

/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between inner data types and the interface.*/
export interface IValueConverter {
    convert: (value: any) => string | null,
    convertBack: (value: string | null) => any
}