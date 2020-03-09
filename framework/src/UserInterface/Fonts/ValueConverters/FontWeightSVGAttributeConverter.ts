import { FontWeight } from "../index";
import { Font } from "../Font";
import { InvalidOperationException } from "../../../Standard/index";

export class FontWeightSVGAttributeConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;
        else
            switch (value.weight) {
                case FontWeight.Normal:
                    return "normal";
                case FontWeight.Bold:
                    return "bold";
                case FontWeight.Bolder:
                    return "bolder";
                case FontWeight.Lighter:
                    return "lighter";
                default:
                    return null;
            }
    }

    convertBack(value: string | null): number | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
};