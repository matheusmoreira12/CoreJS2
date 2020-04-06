import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index.js";
import { Type } from "../../../Standard/Types/Type.js";
import { Length } from "../../Coordinates/index.js";

export class ColumnDefinition extends DependencyObject {
    static widthProperty = DependencyProperty.register(ColumnDefinition, "width", { valueType: Type.get(Length), defaultValue: Length.auto });
    get width(): Length { return this.get(ColumnDefinition.widthProperty); }
    set width(value: Length) { this.set(ColumnDefinition.widthProperty, value); }
}