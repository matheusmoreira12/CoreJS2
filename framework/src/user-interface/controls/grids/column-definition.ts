import { DependencyObject, DependencyProperty, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { Type } from "../../../standard/reflection/type.js";
import { Length } from "../../coordinates/index.js";

export class ColumnDefinition extends DependencyObject {
    static widthProperty = DependencyProperty.registerAttached(Type.get(ColumnDefinition), "width", new PropertyMetadata(Type.get(Length), Length.zero));
    get width(): Length { return this.get(ColumnDefinition.widthProperty); }
    set width(value: Length) { this.set(ColumnDefinition.widthProperty, value); }

    static maximumWidthProperty = DependencyProperty.registerAttached(Type.get(ColumnDefinition), "maximumWidth", new PropertyMetadata(Type.get(Length), Length.zero));
    get maximumWidth(): Length { return this.get(ColumnDefinition.maximumWidthProperty); }
    set maximumWidth(value: Length) { this.set(ColumnDefinition.maximumWidthProperty, value); }

    static minimumWidthProperty = DependencyProperty.registerAttached(Type.get(ColumnDefinition), "minimumWidth", new PropertyMetadata(Type.get(Length), Length.infinity));
    get minimumWidth(): Length { return this.get(ColumnDefinition.minimumWidthProperty); }
    set minimumWidth(value: Length) { this.set(ColumnDefinition.minimumWidthProperty, value); }
}