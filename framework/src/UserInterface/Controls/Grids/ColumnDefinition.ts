import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index.js";
import { Type } from "../../../Standard/Types/Type.js";
import { Length } from "../../Coordinates/index.js";

export class GridColumnDefinition extends DependencyObject {
    static widthProperty = DependencyProperty.register(GridColumnDefinition, "width", { valueType: Type.get(Length), defaultValue: Length.auto });
    get width(): Length { return this.get(GridColumnDefinition.widthProperty); }
    set width(value: Length) { this.set(GridColumnDefinition.widthProperty, value); }
}