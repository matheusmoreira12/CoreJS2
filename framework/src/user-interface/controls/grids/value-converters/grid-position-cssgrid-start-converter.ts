import { IValueConverter } from "../../../value-converters/index.js";
import { NotSupportedException } from "../../../../standard/exceptions/index.js"

export class GridPositionCSSGridStartConverter implements IValueConverter {
    convert(value: number | null): string | null {
        if (value == null)
            return null;

        return `${value}`;
    }

    convertBack(value: string | null): number | null {
        throw new NotSupportedException("Backwards conversion not supported.");
    }
}