import { Font } from "../font.js";
import { InvalidOperationException } from "../../../standard/exceptions/index.js"
import { FontStyleSVGAttributeConverter } from "./font-style-svg-attribute-converter.js";

export class FontSVGFontStyleAttributeConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;

        return new FontStyleSVGAttributeConverter().convert(value.style);
    }

    convertBack(): Font | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
};