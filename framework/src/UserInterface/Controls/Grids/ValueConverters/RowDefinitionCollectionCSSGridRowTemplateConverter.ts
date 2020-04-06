import { IValueConverter } from "../../../ValueConverters/index.js";
import { LengthCSSPropertyConverter } from "../../../Coordinates/ValueConverters/index.js";
import { RowDefinition } from "../RowDefinition.js";

export class RowDefinitionCollectionCSSGridRowTemplateConverter implements IValueConverter {
    convert(value: RowDefinition[] | null): string | null {
        if (value === null)
            return null;
        else
            return value.map(c => new LengthCSSPropertyConverter().convert(c.height)).join(" ");
    }

    convertBack(value: string | null): RowDefinition[] | null {
        if (value === null)
            return null;
        else {
            return value.split(" ").map(h => {
                const def = new RowDefinition();
                def.height = new LengthCSSPropertyConverter().convertBack(h)!;
                return def;
            });
        }
    }
}