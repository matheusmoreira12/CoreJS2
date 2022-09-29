import { DependencyObject, DependencyProperty } from "../../standard/dependency-objects/index.js";
import { Type } from "../../standard/reflection/type.js";

export class DataContract extends DependencyObject {
    update(data: object) {
        const props = DependencyProperty.getAll(Type.of(this));
        for (let prop of props) {
            const value = data[<keyof typeof data>prop.name];
            const meta = DependencyProperty.getMetadata(prop);
            if (value !== undefined) {
                const oldValue = this.get(prop);
                const valueType = meta.valueType;
                if (valueType && Type.get(DataContract).matches(valueType))
                    oldValue.update(value);
                else
                    this.set(prop, value);
            }
        }
    }
}