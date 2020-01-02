import { Dictionary } from "../../Standard/Collections/Dictionary";

export class ColorPalette {
    constructor(descriptor: { [key: string]: number }) {
        this.colors = Dictionary.fromKeyValueObject(descriptor);

        for (let name of this.colors.getKeys()) {
            Object.defineProperty(this, name, {
                get() {
                    return this.colors[name];
                }
            });
        }
    }

    colors: Dictionary<string, number>;
}