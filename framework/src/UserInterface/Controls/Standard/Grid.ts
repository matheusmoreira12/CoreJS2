import { Control, ControlManager } from "../index.js";

export class Grid extends Control {
    __initialization() {
        super.__initialization();

        this.style.display = "grid";
        this.style.gridAutoRows = "0";
        this.style.gridAutoFlow = "row";
    }
}
ControlManager.register(Grid, "core:Grid", "core");