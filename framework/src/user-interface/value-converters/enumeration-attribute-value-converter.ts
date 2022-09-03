import { IValueConverter } from "./index.js";
import { Enumeration } from "../../standard/index.js";


export class EnumerationAttributeValueConverter implements IValueConverter {
    constructor(enumeration: Enumeration) {
        this.__enumeration = enumeration;
    }

    convertBack(value: string | null): number | null {
        if (value === null)
            return null;

        return this.__enumeration.fromLabel(value);
    }

    convert(value: number | null): string | null {
        if (value === null)
            return null;

        return this.__enumeration.getLabel(value);
    }

    private __enumeration: Enumeration;
}
