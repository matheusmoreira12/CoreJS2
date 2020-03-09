import { Font } from "../Font";
import { InvalidOperationException } from "../../../Standard/index";
import { FontStyleSVGAttributeConverter } from "./FontStyleSVGAttributeConverter";

export class FontSVGFontStyleAttributeConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;
        else
            return new FontStyleSVGAttributeConverter().convert(value.style);
    }

    convertBack(): Font | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
};