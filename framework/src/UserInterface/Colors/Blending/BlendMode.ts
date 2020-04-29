//Documentation: https://www.w3.org/TR/compositing-1/

import { Color } from "../Color.js";
import { InvalidOperationException } from "../../../Standard/Exceptions/index.js";

export abstract class BlendMode {
    constructor() {
        if (new.target === BlendMode)
            throw new InvalidOperationException("Invalid constructor.");
    }

    public abstract blend(cb: Color, cs: Color): Color;
}

