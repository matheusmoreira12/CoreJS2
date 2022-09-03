import { IValueConverter } from "./index.js";
import { ContextSelectionFlags } from "../../standard/index.js";


export class FlagsAttributeValueConverter implements IValueConverter {
    convertBack(value: string | null): ContextSelectionFlags | null {
        if (value === null)
            return null;

        return ContextSelectionFlags.parse(value);
    }

    convert(value: ContextSelectionFlags | null): string | null {
        if (value === null)
            return null;

        return value.toString();
    }
}
