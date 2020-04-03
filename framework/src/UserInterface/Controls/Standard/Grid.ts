import { Control, ControlManager } from "../index.js";
import { DependencyProperty } from "../../DependencyObjects/index.js";
import { Type } from "../../../Standard/Types/Type.js";

export class Grid extends Control {
    __initialization() {
        super.__initialization();

        this.style.display = "grid";
        this.style.gridTemplateColumns = "auto";
        this.style.gridTemplateRows = "auto";
    }

    protected __updateGrid() {
        for (let child of this.children) {
            if (child instanceof Control) {
                const row = child.get(Grid.rowProperty);
                const column = child.get(Grid.columnProperty);
                child.style.gridRow = String(row);
                child.style.gridColumn = String(column);
            }
        }
    }

    static rowProperty = DependencyProperty.register(Grid, "row", { valueType: Type.get(Number), defaultValue: 1 });
    static columnProperty = DependencyProperty.register(Grid, "column", { valueType: Type.get(Number), defaultValue: 1 });
}
ControlManager.register(Grid, "core:Grid", "core");