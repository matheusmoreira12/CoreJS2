import { Enumeration, InvalidOperationException } from "../../../Standard/index";
import { TextDecoration } from "../index";
import { Font } from "../Font";

export class TextDecorationSVGAttributeConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;
        else {
            const flags = [];
            if (Enumeration.contains(TextDecoration.Underline, value.textDecoration))
                flags.push("underline");
            if (Enumeration.contains(TextDecoration.Overline, value.textDecoration))
                flags.push("overline");
            if (Enumeration.contains(TextDecoration.StrikeThrough, value.textDecoration))
                flags.push("line-through");
            if (flags.length == 0)
                return "none";
            return flags.join(" ");
        }
    }

    convertBack(value: string | null): Font | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
};