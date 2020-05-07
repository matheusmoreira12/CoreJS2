import { DependencyObject, DependencyProperty } from "../../UserInterface/DependencyObjects/index.js";

export class DataContract extends DependencyObject {
    update(data: object) {
        const properties = DependencyProperty.getAll(this.constructor);
        for (let property of properties) {
            const value = data[<keyof typeof data>property.name];
            if (value !== undefined) {
                const propOldValue = this.get(property);
                if (propOldValue instanceof DataContract)
                    propOldValue.update(value);
                else
                    this.set(property, value);
            }
        }
    }
}