import { LengthCSSPropertyConverter } from "../../Coordinates/ValueConverters/index.js";
import { IValueConverter } from "../../ValueConverters/index.js";
import { Font } from "../Font.js";
import { InvalidOperationException } from "../../../Standard/index.js";

export class FontSVGFontSizeAttributeConverter implements IValueConverter {
    convert(value: Font): string | null {
        return new LengthCSSPropertyConverter().convert(value.size);
    }

    convertBack(value: string | null): Font | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
}