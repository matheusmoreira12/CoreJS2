import { Color } from "../index.js";
import { BlendMode } from "./index";

export type NonSeparableBlendModeFunction = (cb: Color, cs: Color) => Color;

export class NonSeparableBlendMode extends BlendMode {
    constructor(b: NonSeparableBlendModeFunction) {
        super();
        this.__b = b;
    }

    public blend(cb: Color, cs: Color): Color {
        return this.b(cb, cs);
    }

    get b(): NonSeparableBlendModeFunction { return this.__b; }
    private __b: NonSeparableBlendModeFunction;
}
