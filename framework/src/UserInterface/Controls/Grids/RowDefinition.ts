import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index.js";
import { Type } from "../../../Standard/Types/Type.js";
import { Length } from "../../Coordinates/index.js";

export class GridRowDefinition extends DependencyObject {
    static heightProperty = DependencyProperty.register(GridRowDefinition, "height", { valueType: Type.get(Length), defaultValue: Length.auto });
    get height(): Length { return this.get(GridRowDefinition.heightProperty); }
    set height(value: Length) { this.set(GridRowDefinition.heightProperty, value); }
}