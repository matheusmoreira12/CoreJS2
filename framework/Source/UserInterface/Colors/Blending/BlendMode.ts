//Documentation: https://www.w3.org/TR/compositing-1/

import { Color } from "../Color.js";

export type BlendModeFunction = (cb: Color, cs: Color) => Color;

export class BlendMode {
    constructor(b: BlendModeFunction) {
        this.__b = b;
    }

    get b(): BlendModeFunction { return this.__b; }
    private __b: BlendModeFunction;
}

export class SeparableBlendMode extends BlendMode {

}