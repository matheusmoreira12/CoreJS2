import { IValueConverter } from "../../ValueConverters/index";
import { Length } from "../Length";
import { LengthUnit } from "../LengthUnit";
import { StringReader } from "../../../Standard/Strings/StringReader";
import { MapUtils } from "../../../CoreBase/Utils/index";

const UNIT_SVG_UNIT_MAP = new Map([
    [LengthUnit.None, ""],
    [LengthUnit.Centimeters, "cm"],
    [LengthUnit.Ch, "ch"],
    [LengthUnit.Em, "em"],
    [LengthUnit.Ex, "ex"],
    [LengthUnit.Inches, "in"],
    [LengthUnit.Millimeters, "mm"],
    [LengthUnit.Percent, "%"],
    [LengthUnit.Picas, "pc"],
    [LengthUnit.Pixels, "px"],
    [LengthUnit.Points, "pt"],
    [LengthUnit.Rem, "rem"],
    [LengthUnit.Vh, "vh"],
    [LengthUnit.Vmax, "vmax"],
    [LengthUnit.Vmin, "vmin"],
    [LengthUnit.Vw, "vw"]
]);

export class GraphicValueSVGAttributeValueConverter implements IValueConverter {
    convert(value: Length | null): string | null {
        if (value === null)
            return null;
        else if (value.equals(Length.invalid))
            return null;
        else if (value.equals(Length.auto))
            return "auto";
        else {
            const unitAttr = UNIT_SVG_UNIT_MAP.get(value.unit) || "";
            return `${value.amount}${unitAttr}`;
        }
    }

    convertBack(value: string | null): Length | null {
        function readAmount(reader: StringReader): number {
            let s: string = "";
            while (reader.peek().match(/\d/))
                s += reader.read();
            return Number(s);
        }

        function readUnit(reader: StringReader): number | null {
            let s: string = "";
            while (reader.peek().match(/[A-Za-z%]/))
                s += reader.read();
            const unit = MapUtils.invert(UNIT_SVG_UNIT_MAP).get(s);
            if (unit === undefined)
                return null;
            else
                return unit;
        }

        if (value === null)
            return null;
        else if (value == "auto")
            return Length.auto;
        else {
            const reader = new StringReader(value);
            const amount = readAmount(reader);
            const unit = readUnit(reader);
            if (unit === null)
                return Length.invalid;
            else
                return new Length(amount, unit);
        }
    }
}