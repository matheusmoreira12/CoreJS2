import { DependencyObject } from "../DependencyObjects/index.js";
import { ControlStyle } from "./Styling/index.js";

export abstract class Control extends DependencyObject {
    constructor() {
        super();
    }

    get style(): ControlStyle { return this.__style; }
    private __style: ControlStyle = new ControlStyle(this);
}