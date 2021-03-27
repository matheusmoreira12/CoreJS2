import { Font } from "../font.js";
import { InvalidOperationException } from "../../../standard/exceptions/index.js"
import { FontWeightSVGAttributeConverter } from "./font-weight-svg-attribute-converter.js";

export class FontSVGFontWeightAttributeConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;
        else
            return new FontWeightSVGAttributeConverter().convert(value.weight);
    }

    convertBack(): number | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
};