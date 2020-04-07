import { IValueConverter } from "../../../ValueConverters/index.js";
import { LengthCSSPropertyConverter } from "../../../Coordinates/ValueConverters/index.js";
import { RowDefinition } from "../RowDefinition.js";
import { NotSupportedException } from "../../../../Standard/index.js";

export class RowDefinitionCollectionCSSGridRowTemplateConverter implements IValueConverter {
    convert(value: RowDefinition[] | null): string | null {
        if (value === null)
            return null;
        else
            return value.map(c => new LengthCSSPropertyConverter().convert(c.height)).join(" ");
    }

    convertBack(value: string | null): RowDefinition[] | null {
        throw new NotSupportedException("Backwards conversion not supported.");
    }
}