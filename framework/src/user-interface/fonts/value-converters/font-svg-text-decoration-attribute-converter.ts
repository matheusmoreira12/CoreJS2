import { InvalidOperationException } from "../../../standard/exceptions/index.js"
import { Font } from "../font.js";
import { TextDecorationSVGAttributeConverter } from "./text-decoration-svg-attribute-converter.js";

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