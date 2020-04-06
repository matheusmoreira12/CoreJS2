import { Control, ControlManager } from "../index.js";
import { DependencyProperty, PropertyChangeEventArgs, DependencyObject } from "../../DependencyObjects/index.js";
import { Type } from "../../../Standard/Types/Type.js";
import { LengthCSSPropertyConverter } from "../../Coordinates/ValueConverters/index.js";
import { ColumnDefinition, RowDefinition } from "../Grids/index.js";
import { ObservableCollectionChangeArgs } from "../../../../dist/Standard/Collections/index.js";
import { VisualTreeElement } from "../../VisualTrees/index.js";
import { PropertyBinding, BindingDirection } from "../../Bindings/index.js";
import { Blender } from "../../../Standard/Blender/index.js";
import { ControlStyle } from "../Styling/index.js";
import { Enumeration } from "../../../Standard/index.js";
import { ObservableCollectionChangeAction } from "../../../Standard/Collections/index.js";
import { RowDefinitionCollectionCSSGridRowTemplateConverter, ColumnDefinitionCollectionCSSGridColumnTemplateConverter } from "../Grids/ValueConverters/index.js";

export class Grid extends Control {
    __initialization() {
        super.__initialization();

        this.PropertyChangeEvent.attach(this.__onPropertyChange, this);

        this.children.ChangeEvent.attach(this.__children_onChange, this);

        this.style.display = "grid";

        new PropertyBinding(Blender.get(DependencyObject, this), Grid.rowsProperty, Blender.get(DependencyObject, this.style), ControlStyle.gridTemplateRowsProperty, { direction: BindingDirection.ToTarget, valueConverter: new RowDefinitionCollectionCSSGridRowTemplateConverter() });
        new PropertyBinding(Blender.get(DependencyObject, this), Grid.columnsProperty, Blender.get(DependencyObject, this.style), ControlStyle.gridTemplateColumnsProperty, { direction: BindingDirection.ToTarget, valueConverter: new ColumnDefinitionCollectionCSSGridColumnTemplateConverter() });
    }

    protected __children_onChange(sender: any, args: ObservableCollectionChangeArgs<VisualTreeElement>) {
        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action)) {
            for (let child of args.newItems) {
                if (child instanceof Control) {
                    new PropertyBinding(Blender.get(DependencyObject, child), Grid.rowProperty, Blender.get(DependencyObject, child.style), ControlStyle.gridRowProperty, { direction: BindingDirection.ToTarget });
                    new PropertyBinding(Blender.get(DependencyObject, child), Grid.columnProperty, Blender.get(DependencyObject, child.style), ControlStyle.gridColumnProperty, { direction: BindingDirection.ToTarget });
                }
            }
        }
    }

    protected __onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        if (args.property === Grid.rowsProperty ||
            args.property === Grid.columnsProperty)
            this.__updateVisual();
    }

    static rowsProperty = DependencyProperty.register(Grid, "rows", { valueType: Type.get(Array), defaultValue: [new RowDefinition()] });
    get rows(): RowDefinition[] { return this.get(Grid.rowsProperty); }
    set rows(value: RowDefinition[]) { this.set(Grid.rowsProperty, value); }

    static columnsProperty = DependencyProperty.register(Grid, "columns", { valueType: Type.get(Array), defaultValue: [new ColumnDefinition()] });
    get columns(): ColumnDefinition[] { return this.get(Grid.columnsProperty); }
    set columns(value: ColumnDefinition[]) { this.set(Grid.columnsProperty, value); }

    static rowProperty = DependencyProperty.register(Grid, "row", { valueType: Type.get(Number), defaultValue: 1 });

    static columnProperty = DependencyProperty.register(Grid, "column", { valueType: Type.get(Number), defaultValue: 1 });
}
ControlManager.register(Grid, "core:Grid", "core");