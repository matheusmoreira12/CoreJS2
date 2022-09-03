import { IValueConverter } from "../../../value-converters/index.js";
import { LengthCSSPropertyConverter } from "../../../coordinates/value-converters/index.js";
import { RowDefinition } from "../row-definition.js";
import { NotSupportedException } from "../../../../standard/exceptions/index.js"

export class RowDefinitionCollectionCSSGridRowTemplateConverter implements IValueConverter {
    convert(value: RowDefinition[] | null): string | null {
        if (value === null)
            return null;

        const lengthConverter = new LengthCSSPropertyConverter();
        return value.map(c => lengthConverter.convert(c.height)).join(" ");
    }

    convertBack(value: string | null): RowDefinition[] | null {
        throw new NotSupportedException("Backwards conversion not supported.");
    }
}