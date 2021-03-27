import { IValueConverter } from "./index.js";
import { ContextSelectionFlags, Enumeration } from "../../standard/index.js";

export class BooleanAttributeValueConverter implements IValueConverter {
    convertBack(value: string | null): boolean | null {
        if (value === null)
            return null;
        if (value === "false")
            return false;

        return true;
    }

    convert(value: boolean | null): string | null {
        if (value === null) return null;

        if (value === false) return "false";

        return "";
    }
}

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

export class FlagsAttributeValueConverter implements IValueConverter {
    convertBack(value: string | null): ContextSelectionFlags | null {
        if (value === null)
            return null;

        return ContextSelectionFlags.parse(value);
    }

    convert(value: ContextSelectionFlags | null): string | null {
        if (value === null)
            return null;

        return value.toString();
    }
}

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