import { IValueConverter } from "../../ValueConverters/index.js";
import { Font } from "../Font.js";
import { InvalidOperationException } from "../../../Standard/index.js";

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