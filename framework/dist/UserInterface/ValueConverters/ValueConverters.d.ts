import { IValueConverter } from "./index.js";
import { ContextSelectionFlags, Enumeration } from "../../Standard/index.js";
export declare class BooleanAttributeValueConverter implements IValueConverter {
    convertBack(value: string | null): boolean | null;
    convert(value: boolean | null): string | null;
}
export declare class JSONAttributeValueConverter implements IValueConverter {
    convertBack(value: string | null): JSON | null;
    convert(value: JSON | null): string | null;
}
export declare class FlagsAttributeValueConverter implements IValueConverter {
    convertBack(value: string | null): ContextSelectionFlags | null;
    convert(value: ContextSelectionFlags | null): string | null;
}
export declare class EnumerationAttributeValueConverter implements IValueConverter {
    constructor(enumeration: Enumeration);
    convertBack(value: string | null): number | null;
    convert(value: number | null): string | null;
    private __enumeration;
}
