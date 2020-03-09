import { IValueConverter } from "../../ValueConverters/index";
import { Scalar } from "../Scalar";
import { VisualUnit } from "../VisualUnit";
import { StringReader } from "../../../Standard/Strings/StringReader";
import { MapUtils } from "../../../CoreBase/Utils/index";

const UNIT_SVG_UNIT_MAP = new Map([
    [VisualUnit.Centimeters, "cm"],
    [VisualUnit.Ch, "ch"],
    [VisualUnit.Em, "em"],
    [VisualUnit.Ex, "ex"],
    [VisualUnit.Inches, "in"],
    [VisualUnit.Millimeters, "mm"],
    [VisualUnit.None, ""],
    [VisualUnit.Percent, "%"],
    [VisualUnit.Picas, "pc"],
    [VisualUnit.Pixels, "px"],
    [VisualUnit.Points, "pt"],
    [VisualUnit.Rem, "rem"],
    [VisualUnit.Vh, "vh"],
    [VisualUnit.Vmax, "vmax"],
    [VisualUnit.Vmin, "vmin"],
    [VisualUnit.Vw, "vw"]
]);

export class ScalarSVGAttributeValueConverter implements IValueConverter {
    convert(value: Scalar | null): string | null {
        if (value === null)
            return null;
        else {
            const unitAttr = UNIT_SVG_UNIT_MAP.get(value.unit) || "";
            return `${value.amount}${unitAttr}`;
        }
    }

    convertBack(value: string | null): any {
        function readAmount(reader: StringReader): number {
            let s: string = "";
            while (reader.peek().match(/\d/))
                s += reader.read();
            return Number(s);
        }

        function readUnit(reader: StringReader): number {
            let s: string = "";
            while (reader.peek().match(/[A-Za-z%]/))
                s += reader.read();
            const unit = MapUtils.invert(UNIT_SVG_UNIT_MAP).get(s);
            if (unit === undefined)
                return VisualUnit.Invalid;
            else
                return unit;
        }

        if (value === null)
            return null;
        else {
            const reader = new StringReader(value);
            const amount = readAmount(reader);
            const unit = readUnit(reader);
            return new Scalar(amount, unit);
        }
    }
}