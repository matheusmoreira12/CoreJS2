import { FontWeight } from "./FontWeight.js";
import { TextDecoration } from "./TextDecoration.js";
import { FontStyle } from "./FontStyle.js";
import { assertParams } from "../../Validation/index.js";
import { Length, LengthUnit } from "../Coordinates/index.js";


export class Font {
    static get default(): Font { return DEFAULT_FONT; }

    constructor(family: string, size: Length, weight: number = FontWeight.Normal, style: number = FontStyle.Normal, textDecoration: number = TextDecoration.None) {
        assertParams({ family }, [String]);
        assertParams({ size }, [Length]);
        assertParams({ weight, style, textDecoration }, [Number]);

        this.__family = family;
        this.__size = size;
        this.__weight = weight;
        this.__style = style;
        this.__textDecoration = textDecoration;
    }

    get family(): string { return this.__family; }
    private __family: string;

    get size(): Length { return this.__size; }
    private __size: Length;

    get weight(): number { return this.__weight; }
    private __weight: number;

    get style(): number { return this.__style; }
    private __style: number;

    get textDecoration(): number { return this.__textDecoration; }
    private __textDecoration: number;
}

const DEFAULT_FONT_FAMILY = "Arial, Verdana, Sans-serif";
const DEFAULT_FONT_SIZE = new Length(10, LengthUnit.Points);
const DEFAULT_FONT = new Font(DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE);