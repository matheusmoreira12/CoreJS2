import { Enumeration } from "../../Standard/index.js";

export const LengthUnit = Enumeration.create({
    None: 0,
    //Absolute Lengths
    Centimeters: null,
    Millimeters: null,
    Inches: null,
    Pixels: null,
    Points: null,
    Picas: null,
    //Relative Lengths
    Em: null,
    Ex: null,
    Ch: null,
    Rem: null,
    Vw: null,
    Vh: null,
    Vmin: null,
    Vmax: null,
    Percent: null
});