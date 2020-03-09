import { Enumeration, InvalidOperationException } from "../../../Standard/index";
import { TextDecoration } from "../index";
import { Font } from "../Font";
import { TextDecorationSVGAttributeConverter } from "./TextDecorationSVGAttributeConverter";

export class FontSVGTextDecorationAttributeConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;
        else
            return new TextDecorationSVGAttributeConverter().convert(value.textDecoration);
    }

    convertBack(value: string | null): Font | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
};