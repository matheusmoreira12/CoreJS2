import { Length } from "./index.js";
import { assertParams } from "../../validation/index.js";

export class Offset {
    static get zero(): Offset { return ZERO };

    static getCentimeters(x: number, y: number): Offset { return new Offset(Length.getCentimeters(x), Length.getCentimeters(y)); }

    static getMillimeters(x: number, y: number): Offset { return new Offset(Length.getMillimeters(x), Length.getMillimeters(y)); }

    static getInches(x: number, y: number): Offset { return new Offset(Length.getInches(x), Length.getInches(y)); }

    static getPixels(x: number, y: number): Offset { return new Offset(Length.getPixels(x), Length.getPixels(y)); }

    static getPoints(x: number, y: number): Offset { return new Offset(Length.getPoints(x), Length.getPoints(y)); }

    static getPicas(x: number, y: number): Offset { return new Offset(Length.getPicas(x), Length.getPicas(y)); }

    static getEm(x: number, y: number): Offset { return new Offset(Length.getEm(x), Length.getEm(y)); }

    static getEx(x: number, y: number): Offset { return new Offset(Length.getEx(x), Length.getEx(y)); }

    static getCh(x: number, y: number): Offset { return new Offset(Length.getCh(x), Length.getCh(y)); }

    static getRem(x: number, y: number): Offset { return new Offset(Length.getRem(x), Length.getRem(y)); }

    static getVw(x: number, y: number): Offset { return new Offset(Length.getVw(x), Length.getVw(y)); }

    static getVh(x: number, y: number): Offset { return new Offset(Length.getVh(x), Length.getVh(y)); }

    static getVmin(x: number, y: number): Offset { return new Offset(Length.getVmin(x), Length.getVmin(y)); }

    static getVmax(x: number, y: number): Offset { return new Offset(Length.getVmax(x), Length.getVmax(y)); }

    static getPercent(x: number, y: number): Offset { return new Offset(Length.getPercent(x), Length.getPercent(y)); }

    constructor(x: Length, y: Length) {
        assertParams({ x, y }, [Length]);

        this.#x = x;
        this.#y = y;
    }

    add(offset: Offset): Offset {
        return new Offset(this.x.add(offset.x), this.y.add(offset.y));
    }

    subtract(offset: Offset): Offset {
        return new Offset(this.x.subtract(offset.x), this.y.subtract(offset.y));
    }

    get x(): Length { return this.#x; }
    #x: Length;

    get y(): Length { return this.#y; }
    #y: Length;
}

const ZERO = new Offset(Length.zero, Length.zero);