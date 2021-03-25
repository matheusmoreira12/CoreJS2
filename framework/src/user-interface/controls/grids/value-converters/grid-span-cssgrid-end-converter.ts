import { IValueConverter } from "../../../ValueConverters/index.js";
import { NotSupportedException } from "../../../../Standard/Exceptions/index.js"

export class GridSpanCSSGridEndConverter implements IValueConverter {
    convert(value: number | number): string | null {
        if (value === null)
            return null;
        else
            return `span ${value}`;
    }

    convertBack(value: string | null): number | null {
        throw new NotSupportedException("Backwards conversion not supported.");
    }
}