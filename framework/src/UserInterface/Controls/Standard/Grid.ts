import { Control, ControlManager } from "../index.js";
import { DependencyProperty, PropertyChangeEventArgs } from "../../DependencyObjects/index.js";
import { Type } from "../../../Standard/Types/Type.js";
import { LengthCSSAttributeValueConverter } from "../../Coordinates/ValueConverters/index.js";
import { GridColumnDefinition, GridRowDefinition } from "../Grids/index.js";
import { ObservableCollectionChangeArgs } from "../../../../dist/Standard/Collections/index.js";
import { VisualTreeElement } from "../../VisualTrees/index.js";

export class Grid extends Control {
    __initialization() {
        super.__initialization();

        this.style.display = "grid";
        this.style.gridTemplateColumns = "auto";
        this.style.gridTemplateRows = "auto";

        this.PropertyChangeEvent.attach(this.__onPropertyChange, this);

        this.children.ChangeEvent.attach(this.__children_onChange, this);

        this.__updateVisual();
    }

    private __updateGrid() {
        const templateRows = this.rows.map(r => new LengthCSSAttributeValueConverter().convert(r.height)!).join(" ");
        this.style.gridTemplateRows = templateRows;

        const templateColumns = this.columns.map(c => new LengthCSSAttributeValueConverter().convert(c.width)!).join(" ");
        this.style.gridTemplateColumns = templateColumns;

        for (let child of this.children) {
            if (child instanceof Control) {
                const row = child.get(Grid.rowProperty);
                child.style.gridRow = String(row);

                const column = child.get(Grid.columnProperty);
                child.style.gridColumn = String(column);
            }
        }
    }

    protected __children_onChange(sender: any, args: ObservableCollectionChangeArgs<VisualTreeElement>) {
        this.__updateVisual();
    }

    protected __updateVisual() {
        this.__updateGrid();
    }

    protected __onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        if (args.property === Grid.rowsProperty ||
            args.property === Grid.columnsProperty)
            this.__updateVisual();
    }

    static rowsProperty = DependencyProperty.register(Grid, "rows", { valueType: Type.get(Array), defaultValue: [new GridRowDefinition()] });
    get rows(): GridRowDefinition[] { return this.get(Grid.rowsProperty); }
    set rows(value: GridRowDefinition[]) { this.set(Grid.rowsProperty, value); }

    static columnsProperty = DependencyProperty.register(Grid, "columns", { valueType: Type.get(Array), defaultValue: [new GridColumnDefinition()] });
    get columns(): GridColumnDefinition[] { return this.get(Grid.columnsProperty); }
    set columns(value: GridColumnDefinition[]) { this.set(Grid.columnsProperty, value); }

    static rowProperty = DependencyProperty.register(Grid, "row", { valueType: Type.get(Number), defaultValue: 1 });
    static columnProperty = DependencyProperty.register(Grid, "column", { valueType: Type.get(Number), defaultValue: 1 });
}
ControlManager.register(Grid, "core:Grid", "core");