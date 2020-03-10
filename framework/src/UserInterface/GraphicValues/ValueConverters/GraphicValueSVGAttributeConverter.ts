import { IValueConverter } from "../../ValueConverters/index";
import { GraphicValue } from "../GraphicValue";
import { GraphicUnit } from "../GraphicUnit";
import { StringReader } from "../../../Standard/Strings/StringReader";
import { MapUtils } from "../../../CoreBase/Utils/index";

const UNIT_SVG_UNIT_MAP = new Map([
    [GraphicUnit.Centimeters, "cm"],
    [GraphicUnit.Ch, "ch"],
    [GraphicUnit.Em, "em"],
    [GraphicUnit.Ex, "ex"],
    [GraphicUnit.Inches, "in"],
    [GraphicUnit.Millimeters, "mm"],
    [GraphicUnit.None, ""],
    [GraphicUnit.Percent, "%"],
    [GraphicUnit.Picas, "pc"],
    [GraphicUnit.Pixels, "px"],
    [GraphicUnit.Points, "pt"],
    [GraphicUnit.Rem, "rem"],
    [GraphicUnit.Vh, "vh"],
    [GraphicUnit.Vmax, "vmax"],
    [GraphicUnit.Vmin, "vmin"],
    [GraphicUnit.Vw, "vw"]
]);

export class GraphicValueSVGAttributeValueConverter implements IValueConverter {
    convert(value: GraphicValue | null): string | null {
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
                return GraphicUnit.Invalid;
            else
                return unit;
        }

        if (value === null)
            return null;
        else {
            const reader = new StringReader(value);
            const amount = readAmount(reader);
            const unit = readUnit(reader);
            return new GraphicValue(amount, unit);
        }
    }
}