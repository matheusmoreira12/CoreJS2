import { Control, ControlManager } from "../index";

export class Grid extends Control {
    __initialization() {
        super.__initialization();

        this.style.display = "grid";
        this.style.gridColumn = "1";
        this.style.gridRow = "1";
    }
}
ControlManager.register(Grid, "core:Grid", "core");