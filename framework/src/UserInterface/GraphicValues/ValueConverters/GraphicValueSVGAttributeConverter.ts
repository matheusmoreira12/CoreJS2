import { IValueConverter } from "../../ValueConverters/index";
import { UnitValue } from "../UnitValue";
import { Unit } from "../Unit";
import { StringReader } from "../../../Standard/Strings/StringReader";
import { MapUtils } from "../../../CoreBase/Utils/index";

const UNIT_SVG_UNIT_MAP = new Map([
    [Unit.Centimeters, "cm"],
    [Unit.Ch, "ch"],
    [Unit.Em, "em"],
    [Unit.Ex, "ex"],
    [Unit.Inches, "in"],
    [Unit.Millimeters, "mm"],
    [Unit.None, ""],
    [Unit.Percent, "%"],
    [Unit.Picas, "pc"],
    [Unit.Pixels, "px"],
    [Unit.Points, "pt"],
    [Unit.Rem, "rem"],
    [Unit.Vh, "vh"],
    [Unit.Vmax, "vmax"],
    [Unit.Vmin, "vmin"],
    [Unit.Vw, "vw"]
]);

export class GraphicValueSVGAttributeValueConverter implements IValueConverter {
    convert(value: UnitValue | null): string | null {
        if (value === null || value.isInvalid)
            return null;
        else if (value.isAuto)
            return "auto";
        else {
            const unitAttr = UNIT_SVG_UNIT_MAP.get(value.unit) || "";
            return `${value.amount}${unitAttr}`;
        }
    }

    convertBack(value: string | null): UnitValue | null {
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
                return Unit.Invalid;
            else
                return unit;
        }

        if (value === null)
            return null;
        else if (value == "auto")
            return UnitValue.auto;
        else {
            const reader = new StringReader(value);
            const amount = readAmount(reader);
            const unit = readUnit(reader);
            return new UnitValue(amount, unit);
        }
    }
}