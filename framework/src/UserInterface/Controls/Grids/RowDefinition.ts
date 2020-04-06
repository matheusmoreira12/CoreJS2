import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index.js";
import { Type } from "../../../Standard/Types/Type.js";
import { Length } from "../../Coordinates/index.js";

export class RowDefinition extends DependencyObject {
    static heightProperty = DependencyProperty.register(RowDefinition, "height", { valueType: Type.get(Length), defaultValue: Length.auto });
    get height(): Length { return this.get(RowDefinition.heightProperty); }
    set height(value: Length) { this.set(RowDefinition.heightProperty, value); }
}