import { Color } from "../index";
import { ColorRGB } from "../index";

import { BlendMode } from "./index";

export type SeparableBlendModeFunction = (cb: number, cs: number) => number;

export class SeparableBlendMode extends BlendMode {
    constructor(b: SeparableBlendModeFunction) {
        super();
        this.__b = b;
    }

    public blend(cb: Color, cs: Color): Color {
        const cbRGB = cb.toRGB(), csRGB = cs.toRGB();
        return new ColorRGB(this.b(cbRGB.r, csRGB.r), this.b(cbRGB.g, csRGB.g), this.b(cbRGB.b, csRGB.b));
    }

    get b(): SeparableBlendModeFunction { return this.__b; }
    private __b: SeparableBlendModeFunction;
}
