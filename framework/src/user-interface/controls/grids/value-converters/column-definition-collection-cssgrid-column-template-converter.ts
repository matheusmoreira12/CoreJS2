import { IValueConverter } from "../../../value-converters/index.js";
import { ColumnDefinition } from "../index.js";
import { LengthCSSPropertyConverter } from "../../../coordinate-system/value-converters/index.js";
import { NotSupportedException } from "../../../../standard/exceptions/index.js"

export class ColumnDefinitionCollectionCSSGridColumnTemplateConverter implements IValueConverter {
    convert(value: ColumnDefinition[] | null): string | null {
        if (value === null)
            return null;

        const lengthConverter = new LengthCSSPropertyConverter();
        return value.map(c => lengthConverter.convert(c.width)).join(" ");
    }

    convertBack(value: string | null): ColumnDefinition[] | null {
        throw new NotSupportedException("Backwards conversion not supported.");
    }
}