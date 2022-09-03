import { IValueConverter } from "./index.js";


export class JSONAttributeValueConverter implements IValueConverter {
    convertBack(value: string | null): JSON | null {
        if (value === null)
            return null;

        return JSON.parse(value);
    }

    convert(value: JSON | null): string | null {
        if (value === null)
            return null;

        return JSON.stringify(value);
    }
}
