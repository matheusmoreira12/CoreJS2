import { FontWeight } from "./FontWeight";
import { TextDecoration } from "./TextDecoration";
import { FontStyle } from "./FontStyle";

const $family = Symbol("family");
const $size = Symbol("size");
const $weight = Symbol("weight");
const $style = Symbol("style");
const $decoration = Symbol("decoration");

export class Font {
    constructor(family: string, size: string, weight: number = FontWeight.Normal, style: number = FontStyle.Normal, decoration: number = TextDecoration.None) {
        

        this[$family] = family;
        this[$size] = size;
        this[$weight] = weight;
        this[$style] = style;
        this[$decoration] = decoration;
    }

    get family(): string { return this[$family]; }
    [$family]: string;

    get size(): string { return this[$size]; }
    [$size]: string;

    get weight(): number { return this[$weight]; }
    [$weight]: number;

    get style(): number { return this[$style]; }
    [$style]: number;

    get decoration(): number { return this[$decoration]; }
    [$decoration]: number;
}