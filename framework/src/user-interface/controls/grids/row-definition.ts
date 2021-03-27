import { DependencyObject, DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { Type } from "../../../standard/reflection/type.js";
import { Length } from "../../coordinates/index.js";

export class RowDefinition extends DependencyObject {
    static heightProperty = DependencyProperty.registerAttached(RowDefinition, "height", { valueType: Type.get(Length), defaultValue: Length.auto });
    get height(): Length { return this.get(RowDefinition.heightProperty); }
    set height(value: Length) { this.set(RowDefinition.heightProperty, value); }
}