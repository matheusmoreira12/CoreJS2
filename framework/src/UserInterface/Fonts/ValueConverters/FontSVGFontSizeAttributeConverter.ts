import { GraphicValueSVGAttributeValueConverter } from "../../Coordinates/ValueConverters/index";
import { IValueConverter } from "../../ValueConverters/index";
import { Font } from "../Font";
import { InvalidOperationException } from "../../../Standard/index";

export class FontSVGFontSizeAttributeConverter implements IValueConverter {
    convert(value: Font): string | null {
        return new GraphicValueSVGAttributeValueConverter().convert(value.size);
    }

    convertBack(value: string | null): Font | null {
        throw new InvalidOperationException("Cannot convert font back from SVG attribute value.");
    }
}