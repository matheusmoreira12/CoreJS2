import { IValueConverter } from "../../../ValueConverters/index.js";
import { ColumnDefinition } from "../index.js";
import { LengthCSSPropertyConverter } from "../../../Coordinates/ValueConverters/index.js";

export class ColumnDefinitionCollectionCSSGridColumnTemplateConverter implements IValueConverter {
    convert(value: ColumnDefinition[] | null): string | null {
        if (value === null)
            return null;
        else
            return value.map(c => new LengthCSSPropertyConverter().convert(c.width)).join(" ");
    }

    convertBack(value: string | null): ColumnDefinition[] | null {
        if (value === null)
            return null;
        else {
            return value.split(" ").map(w => {
                const def = new ColumnDefinition();
                def.width = new LengthCSSPropertyConverter().convertBack(w)!;
                return def;
            });
        }
    }
}