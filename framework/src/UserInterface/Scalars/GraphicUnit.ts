import { Enumeration } from "../../Standard/index";

export const GraphicUnit = Enumeration.create({
    Invalid: -1,
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