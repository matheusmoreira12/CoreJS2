import { LengthCSSPropertyConverter } from "../../coordinate-system/value-converters/index.js";
import { IValueConverter } from "../../value-converters/index.js";
import { Font } from "../font.js";
import { InvalidOperationException } from "../../../standard/exceptions/index.js"

export class FontSVGFontSizeAttributeConverter implements IValueConverter {
    convert(value: Font): string | null {
        return new LengthCSSPropertyConverter().convert(value.size);
    }

    convertBack(value: string | null): Font | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
}