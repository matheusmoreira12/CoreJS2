import { Point } from "../coordinates/index.js";
import { StylusInteractionType, UserInteractionData } from "./index.js";

export class StylusInteractionData extends UserInteractionData {
    constructor(interactionType: number, position: Point, tipPressure: number) {
        super();

        StylusInteractionType.assertFlag(interactionType);

        this.interactionType = interactionType;
        this.position = position;
        this.tipPressure = tipPressure;

        return Object.freeze(this);
    }

    interactionType: number;
    position: Point;
    tipPressure: number;
}
