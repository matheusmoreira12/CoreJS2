import { MouseButton } from "./mouse-button.js";
import { Point } from "../coordinates/point.js";
import { UserInteractionData } from "./user-interaction-data.js";


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
