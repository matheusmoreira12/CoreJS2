import { Font } from "../Font.js";
import { InvalidOperationException } from "../../../Standard/Exceptions/index.js"
import { FontWeightSVGAttributeConverter } from "./FontWeightSVGAttributeConverter.js";

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