import { FontWeight } from "../index.js";
import { MappedValueConverter } from "../../value-converters/index.js";

const FONT_WEIGHT_SVG_ATTRIBUTE_MAP = new Map([
    [FontWeight.Normal, "normal"],
    [FontWeight.Bold, "bold"],
    [FontWeight.Bolder, "bolder"],
    [FontWeight.Lighter, "lighter"]
]);

export class FontWeightSVGAttributeConverter extends MappedValueConverter<number> {
    constructor() {
        super(FONT_WEIGHT_SVG_ATTRIBUTE_MAP);
    }
};