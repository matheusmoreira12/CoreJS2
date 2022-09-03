import { TextDecoration } from "../index.js";
import { MapUtils } from "../../../core-base/utils/index.js";
import { MappedValueConverter } from "../../value-converters/index.js";

const TEXT_DECORATION_SVG_ATTRIBUTE_MAP = new Map([
    [TextDecoration.None, "none"],
    [TextDecoration.Overline, "overline"],
    [TextDecoration.StrikeThrough, "linethrough"],
    [TextDecoration.Underline, "underline"]
]);

export class TextDecorationSVGAttributeConverter extends MappedValueConverter<number> {
    constructor() {
        super(TEXT_DECORATION_SVG_ATTRIBUTE_MAP);
    }
};