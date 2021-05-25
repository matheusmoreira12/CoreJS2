import { Point } from "../coordinates/point.js";
import { StylusInteractionType } from "./stylus-interaction-type.js";
import { UserInteractionData } from "./user-interaction-data.js";


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
