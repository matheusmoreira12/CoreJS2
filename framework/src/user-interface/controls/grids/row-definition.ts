import { DependencyObject, DependencyProperty, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { Type } from "../../../standard/reflection/type.js";
import { Length } from "../../coordinates/index.js";

export class RowDefinition extends DependencyObject {
    static heightProperty = DependencyProperty.registerAttached(Type.get(RowDefinition), "height", new PropertyMetadata(Type.get(Length), Length.auto));
    get height(): Length { return this.get(RowDefinition.heightProperty); }
    set height(value: Length) { this.set(RowDefinition.heightProperty, value); }
}