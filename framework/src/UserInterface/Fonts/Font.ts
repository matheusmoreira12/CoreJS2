import { FontWeight } from "./FontWeight";
import { TextDecoration } from "./TextDecoration";
import { FontStyle } from "./FontStyle";
import { assertParameter } from "../../Validation/index";

const $family = Symbol("family");
const $size = Symbol("size");
const $weight = Symbol("weight");
const $style = Symbol("style");
const $textDecoration = Symbol("textDecoration");

export class Font {
    constructor(family: string, size: string, weight: number = FontWeight.Normal, style: number = FontStyle.Normal, textDecoration: number = TextDecoration.None) {
        assertParameter("family", family, String);
        assertParameter("size", size, String);
        assertParameter("weight", weight, Number);
        assertParameter("style", style, Number);
        assertParameter("textDecoration", textDecoration, Number);

        this[$family] = family;
        this[$size] = size;
        this[$weight] = weight;
        this[$style] = style;
        this[$textDecoration] = textDecoration;
    }

    get family(): string { return this[$family]; }
    [$family]: string;

    get size(): string { return this[$size]; }
    [$size]: string;

    get weight(): number { return this[$weight]; }
    [$weight]: number;

    get style(): number { return this[$style]; }
    [$style]: number;

    get textDecoration(): number { return this[$textDecoration]; }
    [$textDecoration]: number;
}