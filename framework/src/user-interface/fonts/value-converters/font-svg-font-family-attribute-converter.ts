import { IValueConverter } from "../../value-converters/index.js";
import { Font } from "../font.js";
import { InvalidOperationException } from "../../../standard/exceptions/index.js"

export class FontSVGFontFamilyAttributeConverter implements IValueConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;
        else
            return value.family;
    }

    convertBack(value: string | null): any {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
}