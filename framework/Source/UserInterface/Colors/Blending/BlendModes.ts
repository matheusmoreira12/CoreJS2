import { BlendMode } from "./BlendMode";
import { Color } from "../Color";
import { ColorRGB } from "../ColorRGB";
import { ColorHSL } from "../ColorHSL";

const f_normal = (cb: number, cs: number): number => cs;

const f_multiply = (cb: number, cs: number) => cb * cs;

const f_screen = (cb: number, cs: number) => 1 - ((1 - cb) * (1 - cs));

const f_overlay = (cb: number, cs: number) => f_hardLight(cs, cb);

const f_darken = (cb: number, cs: number) => Math.min(cb, cs);

const f_lighten = (cb: number, cs: number) => Math.max(cb, cs);

function f_colorDodge(cb: number, cs: number): number {
    if (cb == 0)
        return 0;
    if (cb == 1)
        return 1
    return Math.min(1, cb / (1 - cs));
}

function f_colorBurn(cb: number, cs: number) {
    if (cb == 1)
        return 0;
    if (cb == 0)
        return 1;
    return 1 - Math.min(1, (1 - cb) / cs);
}

const f_hardLight = (cb: number, cs: number) => cs <= .5 ? f_multiply(cb, 2 * cs) : f_screen(cb, 2 * cs - 1);

function g_softlight(cb: number) {
    if (cb <= .25)
        return ((16 * cb - 12) * cb + 4) * cb;
    return Math.sqrt(cb);
}

function f_softLight(cb: number, cs: number): number {
    if (cs <= .5)
        return cb - (1 - 2 * cs) * cb * (1 - cb);
    return cb + (2 * cs - 1) * (g_softlight(cs) - cb);
}

const f_difference = (cb: number, cs: number) => Math.abs(cb - cs);

const f_exclusion = (cb: number, cs: number) => cb + cs - 2 * cb * cs;

const f_hue = (cb: Color, cs: Color) => {
    const cbHSL = cb.toHSL(),
        csHSL = cs.toHSL();
    return new ColorHSL(csHSL.h, cbHSL.s, cbHSL.l)
};

const f_saturation = (cb: Color, cs: Color) => {
    const cbHSL = cb.toHSL(),
        csHSL = cs.toHSL();
    return new ColorHSL(cbHSL.h, csHSL.s, cbHSL.l)
};

const f_color = (cb: Color, cs: Color) => {
    const cbHSL = cb.toHSL(),
        csHSL = cs.toHSL();
    return new ColorHSL(csHSL.h, csHSL.s, cbHSL.l)
};

const f_luminosity = (cb: Color, cs: Color) => {
    const cbHSL = cb.toHSL(),
        csHSL = cs.toHSL();
    return new ColorHSL(cbHSL.h, cbHSL.s, csHSL.l)
};

const BlendModes = {
    Normal: new SeparableBlendMode(f_normal),

    Multiply: new SeparableBlendMode(f_multiply),

    Screen: new SeparableBlendMode(f_screen),

    Overlay: new SeparableBlendMode(f_overlay),

    Darken: new SeparableBlendMode(f_darken),

    Lighten: new SeparableBlendMode(f_lighten),

    Hue: new NonSeparableBlendMode(f_hue),

    Saturation: new NonSeparableBlendMode(f_saturation),

    Color: new NonSeparableBlendMode(f_color),

    Luminosity: new NonSeparableBlendMode(f_luminosity)
};

export default BlendModes;