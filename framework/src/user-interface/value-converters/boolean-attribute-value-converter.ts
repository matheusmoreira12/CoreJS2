import { IValueConverter } from "./index.js";


export class BooleanAttributeValueConverter implements IValueConverter {
    convertBack(value: string | null): boolean | null {
        if (value === null)
            return null;
        if (value === "false")
            return false;

        return true;
    }

    convert(value: boolean | null): string | null {
        if (value === null)
            return null;

        if (value === false)
            return "false";

        return "";
    }
}
