import { Length, Offset } from "./index.js";
import { assertParams } from "../../validation/index.js";

export class Point {
    static get zero(): Point { return ZERO };

    static getCentimeters(x: number, y: number): Point { return new Point(Length.getCentimeters(x), Length.getCentimeters(y)); }

    static getMillimeters(x: number, y: number): Point { return new Point(Length.getMillimeters(x), Length.getMillimeters(y)); }

    static getInches(x: number, y: number): Point { return new Point(Length.getInches(x), Length.getInches(y)); }

    static getPixels(x: number, y: number): Point { return new Point(Length.getPixels(x), Length.getPixels(y)); }

    static getPoints(x: number, y: number): Point { return new Point(Length.getPoints(x), Length.getPoints(y)); }

    static getPicas(x: number, y: number): Point { return new Point(Length.getPicas(x), Length.getPicas(y)); }

    static getEm(x: number, y: number): Point { return new Point(Length.getEm(x), Length.getEm(y)); }

    static getEx(x: number, y: number): Point { return new Point(Length.getEx(x), Length.getEx(y)); }

    static getCh(x: number, y: number): Point { return new Point(Length.getCh(x), Length.getCh(y)); }

    static getRem(x: number, y: number): Point { return new Point(Length.getRem(x), Length.getRem(y)); }

    static getVw(x: number, y: number): Point { return new Point(Length.getVw(x), Length.getVw(y)); }

    static getVh(x: number, y: number): Point { return new Point(Length.getVh(x), Length.getVh(y)); }

    static getVmin(x: number, y: number): Point { return new Point(Length.getVmin(x), Length.getVmin(y)); }

    static getVmax(x: number, y: number): Point { return new Point(Length.getVmax(x), Length.getVmax(y)); }

    static getPercent(x: number, y: number): Point { return new Point(Length.getPercent(x), Length.getPercent(y)); }

    constructor(x: Length, y: Length) {
        assertParams({ x, y }, [Length]);

        this.#x = x;
        this.#y = y;
    }

    add(offset: Offset): Point {
        assertParams({ offset }, [Offset]);

        return new Point(this.x.subtract(offset.x), this.y.subtract(offset.y));
    }

    subtract(point: Point): Offset {
        assertParams({ point }, [Point]);

        return new Offset(this.x.subtract(point.x), this.y.subtract(point.y));
    }

    get x(): Length { return this.#x; }
    #x: Length;

    get y(): Length { return this.#y; }
    #y: Length;
}

const ZERO = new Point(Length.zero, Length.zero);