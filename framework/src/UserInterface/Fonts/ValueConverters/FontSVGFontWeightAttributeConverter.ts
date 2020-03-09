import { FontWeight } from "../index";
import { Font } from "../Font";
import { InvalidOperationException } from "../../../Standard/index";
import { FontWeightSVGAttributeConverter } from "./FontWeightSVGAttributeConverter";

export class FontSVGFontWeightAttributeConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;
        else
            return new FontWeightSVGAttributeConverter().convert(value.weight);
    }

    convertBack(value: string | null): number | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
};