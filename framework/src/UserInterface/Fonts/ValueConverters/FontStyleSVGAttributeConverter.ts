import { FontStyle } from "../index";
import { Font } from "../Font";
import { InvalidOperationException } from "../../../Standard/index";

export class FontStyleSVGAttributeConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;
        else
            switch (value.style) {
                case FontStyle.Normal:
                    return "normal";
                case FontStyle.Italic:
                    return "italic"
                case FontStyle.Oblique:
                    return "oblique";
                default:
                    return null;
            }
    }

    convertBack(value: string | null): Font | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
};