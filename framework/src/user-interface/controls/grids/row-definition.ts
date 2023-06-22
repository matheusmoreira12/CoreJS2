import { DependencyObject, DependencyProperty, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { Type } from "../../../standard/reflection/type.js";
import { Length } from "../../coordinates/index.js";

export class RowDefinition extends DependencyObject {
    static heightProperty = DependencyProperty.registerAttached(Type.get(RowDefinition), "height", new PropertyMetadata(Type.get(Length), Length.zero));
    get height(): Length { return this.get(RowDefinition.heightProperty); }
    set height(value: Length) { this.set(RowDefinition.heightProperty, value); }

    static maximumHeightProperty = DependencyProperty.registerAttached(Type.get(RowDefinition), "maximumHeight", new PropertyMetadata(Type.get(Length), Length.zero));
    get maximumHeight(): Length { return this.get(RowDefinition.maximumHeightProperty); }
    set maximumHeight(value: Length) { this.set(RowDefinition.maximumHeightProperty, value); }

    static minimumHeightProperty = DependencyProperty.registerAttached(Type.get(RowDefinition), "minimumHeight", new PropertyMetadata(Type.get(Length), Length.positiveInfinity));
    get minimumHeight(): Length { return this.get(RowDefinition.minimumHeightProperty); }
    set minimumHeight(value: Length) { this.set(RowDefinition.minimumHeightProperty, value); }
}