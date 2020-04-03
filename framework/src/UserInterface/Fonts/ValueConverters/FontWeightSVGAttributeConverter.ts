import { FontWeight } from "../index.js";
import { MapUtils } from "../../../CoreBase/Utils/index.js";
import { IValueConverter } from "../../ValueConverters/index.js";

const FONT_WEIGHT_SVG_ATTRIBUTE_MAP = new Map([
    [FontWeight.Normal, "normal"],
    [FontWeight.Bold, "bold"],
    [FontWeight.Bolder, "bolder"],
    [FontWeight.Lighter, "lighter"]
]);

export class FontWeightSVGAttributeConverter implements IValueConverter {
    convert(value: number | null): string | null {
        if (value === null)
            return null;
        else
            return FONT_WEIGHT_SVG_ATTRIBUTE_MAP.get(value) || "";
    }

    convertBack(value: string | null): number | null {
        if (value === null)
            return null;
        else {
            const weight = MapUtils.invert(FONT_WEIGHT_SVG_ATTRIBUTE_MAP).get(value);
            if (weight === undefined)
                return null;
            else
                return weight;
        }
    }
};