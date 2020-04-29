import { IValueConverter } from "../../../ValueConverters/index.js";
import { NotSupportedException } from "../../../../Standard/Exceptions/index.js"

export class GridPositionCSSGridStartConverter implements IValueConverter {
    convert(value: number | null): string | null {
        return `${value}`;
    }

    convertBack(value: string | null): number | null {
        throw new NotSupportedException("Backwards conversion not supported.");
    }
}