import { FontStyle } from "../index";
import { MapUtils } from "../../../CoreBase/Utils/index";
import { IValueConverter } from "../../ValueConverters/index";

const FONT_STYLE_SVG_ATTRIBUTE_MAP = new Map([
    [FontStyle.Normal, "normal"],
    [FontStyle.Italic, "italic"],
    [FontStyle.Oblique, "oblique"]
]);

export class FontStyleSVGAttributeConverter implements IValueConverter {
    convert(value: number | null): string | null {
        if (value === null)
            return null;
        else
            return FONT_STYLE_SVG_ATTRIBUTE_MAP.get(value) || "";
    }

    convertBack(value: string | null): number | null {
        if (value === null)
            return null;
        else {
            const style = MapUtils.invert(FONT_STYLE_SVG_ATTRIBUTE_MAP).get(value);
            if (style === undefined)
                return null;
            else
                return style;
        }
    }
};