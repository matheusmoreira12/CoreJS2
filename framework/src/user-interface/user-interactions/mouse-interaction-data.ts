import { Point } from "../coordinates/index.js";
import { MouseButton, UserInteractionData } from "./index.js";

export class MouseInteractionData extends UserInteractionData {
    constructor(button: number, position: Point) {
        super();

        MouseButton.assertFlag(button);

        this.button = button;
        this.position = position;

        return Object.freeze(this);
    }

    button: number;
    position: Point;
}
