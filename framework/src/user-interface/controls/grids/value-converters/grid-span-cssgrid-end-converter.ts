import { IValueConverter } from "../../../value-converters/index.js";
import { NotSupportedException } from "../../../../standard/exceptions/index.js"

export class GridSpanCSSGridEndConverter implements IValueConverter {
    convert(value: number | number): string | null {
        if (value === null)
            return null;

        return `span ${value}`;
    }

    convertBack(value: string | null): number | null {
        throw new NotSupportedException("Backwards conversion not supported.");
    }
}