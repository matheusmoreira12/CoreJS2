import { Enumeration } from "../../../Standard/index";
import { TextDecoration } from "../index";

export class TextDecorationSVGAttributeConverter {
    convert(value: number | null): string | null {
        if (value === null)
            return null;
        else {
            const flags = [];
            if (Enumeration.contains(TextDecoration.Underline, value))
                flags.push("underline");
            if (Enumeration.contains(TextDecoration.Overline, value))
                flags.push("overline");
            if (Enumeration.contains(TextDecoration.StrikeThrough, value))
                flags.push("line-through");
            if (flags.length == 0)
                return "none";
            return flags.join(" ");
        }
    }

    convertBack(value: string | null): number | null {
        if (value === null)
            return null;
        else {
            if (value == "none")
                return 0;
            else {
                const flags = value.split(" ");
                let result = 0;
                if (flags.includes("underline"))
                    result |= TextDecoration.Underline;
                if (flags.includes("overline"))
                    result |= TextDecoration.Overline;
                if (flags.includes("line-through"))
                    result |= TextDecoration.StrikeThrough;
                return result;
            }
        }
    }
};