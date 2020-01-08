//Documentation: https://www.w3.org/TR/compositing-1/

import { Color } from "../Color.js";
import { InvalidOperationException } from "../../../Standard/Exceptions.js";
import { ColorRGB } from "../ColorRGB.js";

export type SeparableBlendModeFunction = (cb: number, cs: number) => number;
export type NonSeparableBlendModeFunction = (cb: Color, cs: Color) => Color;

export abstract class BlendMode {
    constructor() {
        if (new.target === BlendMode)
            throw new InvalidOperationException("Invalid constructor.");
    }

    public abstract blend(cb: Color, cs: Color): Color;
}

export class SeparableBlendMode extends BlendMode {
    constructor(b: SeparableBlendModeFunction) {
        super();

        this.__b = b;
    }

    public blend(cb: Color, cs: Color): Color {
        const cbRGB = cb.toRGB(),
            csRGB = cs.toRGB();
        return new ColorRGB(this.b(cbRGB.r, csRGB.r), this.b(cbRGB.g, csRGB.g), this.b(cbRGB.b, csRGB.b));
    }

    get b(): SeparableBlendModeFunction { return this.__b; }
    private __b: SeparableBlendModeFunction;
}

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