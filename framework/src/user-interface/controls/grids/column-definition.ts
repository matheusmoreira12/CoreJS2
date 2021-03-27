import { DependencyObject, DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { Type } from "../../../standard/reflection/type.js";
import { Length } from "../../coordinates/index.js";

export class ColumnDefinition extends DependencyObject {
    static widthProperty = DependencyProperty.registerAttached(ColumnDefinition, "width", { valueType: Type.get(Length), defaultValue: Length.auto });
    get width(): Length { return this.get(ColumnDefinition.widthProperty); }
    set width(value: Length) { this.set(ColumnDefinition.widthProperty, value); }
}