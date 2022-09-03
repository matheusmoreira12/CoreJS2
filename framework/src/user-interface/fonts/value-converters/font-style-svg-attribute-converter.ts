import { FontStyle } from "../index.js";
import { MappedValueConverter } from "../../value-converters/index.js";

const FONT_STYLE_SVG_ATTRIBUTE_MAP = new Map([
    [FontStyle.Normal, "normal"],
    [FontStyle.Italic, "italic"],
    [FontStyle.Oblique, "oblique"]
]);

export class FontStyleSVGAttributeConverter extends MappedValueConverter<number> {
    constructor() {
        super(FONT_STYLE_SVG_ATTRIBUTE_MAP);
    }
};