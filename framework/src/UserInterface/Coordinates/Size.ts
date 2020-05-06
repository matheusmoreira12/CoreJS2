import { Length } from "./Length.js";
import { assertParams } from "../../Validation/index.js";


export class Size {
    static get zero(): Size { return ZERO };
    static centimeters(width: number, height: number): Size { return new Size(Length.centimeters(width), Length.centimeters(height)); }
    static millimeters(width: number, height: number): Size { return new Size(Length.millimeters(width), Length.millimeters(height)); }
    static inches(width: number, height: number): Size { return new Size(Length.inches(width), Length.inches(height)); }
    static pixels(width: number, height: number): Size { return new Size(Length.pixels(width), Length.pixels(height)); }
    static points(width: number, height: number): Size { return new Size(Length.points(width), Length.points(height)); }
    static picas(width: number, height: number): Size { return new Size(Length.picas(width), Length.picas(height)); }
    static em(width: number, height: number): Size { return new Size(Length.em(width), Length.em(height)); }
    static ex(width: number, height: number): Size { return new Size(Length.ex(width), Length.ex(height)); }
    static ch(width: number, height: number): Size { return new Size(Length.ch(width), Length.ch(height)); }
    static rem(width: number, height: number): Size { return new Size(Length.rem(width), Length.rem(height)); }
    static vw(width: number, height: number): Size { return new Size(Length.vw(width), Length.vw(height)); }
    static vh(width: number, height: number): Size { return new Size(Length.vh(width), Length.vh(height)); }
    static vmin(width: number, height: number): Size { return new Size(Length.vmin(width), Length.vmin(height)); }
    static vmax(width: number, height: number): Size { return new Size(Length.vmax(width), Length.vmax(height)); }
    static percent(width: number, height: number): Size { return new Size(Length.percent(width), Length.percent(height)); }

    constructor(width: Length, height: Length) {
        assertParams({ width }, [Length]);
        assertParams({ height }, [Length]);

        this.__width = width;
        this.__height = height;
    }

    get width(): Length { return this.__width; }
    private __width: Length;

    get height(): Length { return this.__height; }
    private __height: Length;
}

const ZERO = new Size(Length.zero, Length.zero);