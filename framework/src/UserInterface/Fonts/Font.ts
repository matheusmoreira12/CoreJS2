import { FontWeight } from "./FontWeight";
import { TextDecoration } from "./TextDecoration";
import { FontStyle } from "./FontStyle";
import { assertParams } from "../../Validation/index";
import { GraphicValue, GraphicUnit } from "../GraphicValues/index";

const DEFAULT_FONT_FAMILY = "Arial, Verdana, Sans-serif";
const DEFAULT_FONT_SIZE = new GraphicValue(10, GraphicUnit.Points);

const $family = Symbol("family");
const $size = Symbol("size");
const $weight = Symbol("weight");
const $style = Symbol("style");
const $textDecoration = Symbol("textDecoration");

export class Font {
    static get default(): Font { return new Font(DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE); }

    constructor(family: string, size: GraphicValue, weight: number = FontWeight.Normal, style: number = FontStyle.Normal, textDecoration: number = TextDecoration.None) {
        assertParams({ family }, String);
        assertParams({ size }, GraphicValue);
        assertParams({ weight, style, textDecoration }, Number);

        this[$family] = family;
        this[$size] = size;
        this[$weight] = weight;
        this[$style] = style;
        this[$textDecoration] = textDecoration;
    }

    get family(): string { return this[$family]; }
    [$family]: string;

    get size(): GraphicValue { return this[$size]; }
    [$size]: GraphicValue;

    get weight(): number { return this[$weight]; }
    [$weight]: number;

    get style(): number { return this[$style]; }
    [$style]: number;

    get textDecoration(): number { return this[$textDecoration]; }
    [$textDecoration]: number;
}