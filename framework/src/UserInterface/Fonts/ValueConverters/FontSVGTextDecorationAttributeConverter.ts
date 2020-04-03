import { InvalidOperationException } from "../../../Standard/index.js";
import { Font } from "../Font.js";
import { TextDecorationSVGAttributeConverter } from "./TextDecorationSVGAttributeConverter.js";

export class FontSVGTextDecorationAttributeConverter {
    convert(value: Font | null): string | null {
        if (value === null)
            return null;
        else
            return new TextDecorationSVGAttributeConverter().convert(value.textDecoration);
    }

    convertBack(): Font | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
};