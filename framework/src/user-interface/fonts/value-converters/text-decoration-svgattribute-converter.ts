import { TextDecoration } from "../index.js";
import { MapUtils } from "../../../CoreBase/Utils/index.js";
import { IValueConverter } from "../../ValueConverters/index.js";

const TEXT_DECORATION_SVG_ATTRIBUTE_MAP = new Map([
    [TextDecoration.None, "none"],
    [TextDecoration.Overline, "overline"],
    [TextDecoration.StrikeThrough, "linethrough"],
    [TextDecoration.Underline, "underline"]
]);

export class TextDecorationSVGAttributeConverter implements IValueConverter {
    convert(value: number | null): string | null {
        if (value === null)
            return null;
        else
            return TEXT_DECORATION_SVG_ATTRIBUTE_MAP.get(value) || "";
    }

    convertBack(value: string | null): number | null {
        if (value === null)
            return null;
        else {
            const decoration = MapUtils.invert(TEXT_DECORATION_SVG_ATTRIBUTE_MAP).get(value);
            if (decoration === undefined)
                return null;
            else
                return decoration;
        }
    }
};