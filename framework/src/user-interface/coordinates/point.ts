import { Length } from "./length.js";
import { assertParams } from "../../validation/index.js";

export class Point {
    static get zero(): Point { return ZERO };

    static getCentimeters(width: number, height: number): Point { return new Point(Length.getCentimeters(width), Length.getCentimeters(height)); }

    static getMillimeters(width: number, height: number): Point { return new Point(Length.getMillimeters(width), Length.getMillimeters(height)); }

    static getInches(width: number, height: number): Point { return new Point(Length.getInches(width), Length.getInches(height)); }

    static getPixels(width: number, height: number): Point { return new Point(Length.getPixels(width), Length.getPixels(height)); }

    static getPoints(width: number, height: number): Point { return new Point(Length.getPoints(width), Length.getPoints(height)); }

    static getPicas(width: number, height: number): Point { return new Point(Length.getPicas(width), Length.getPicas(height)); }

    static getEm(width: number, height: number): Point { return new Point(Length.getEm(width), Length.getEm(height)); }

    static getEx(width: number, height: number): Point { return new Point(Length.getEx(width), Length.getEx(height)); }

    static getCh(width: number, height: number): Point { return new Point(Length.getCh(width), Length.getCh(height)); }

    static getRem(width: number, height: number): Point { return new Point(Length.getRem(width), Length.getRem(height)); }

    static getVw(width: number, height: number): Point { return new Point(Length.getVw(width), Length.getVw(height)); }

    static getVh(width: number, height: number): Point { return new Point(Length.getVh(width), Length.getVh(height)); }

    static getVmin(width: number, height: number): Point { return new Point(Length.getVmin(width), Length.getVmin(height)); }

    static getVmax(width: number, height: number): Point { return new Point(Length.getVmax(width), Length.getVmax(height)); }

    static getPercent(width: number, height: number): Point { return new Point(Length.getPercent(width), Length.getPercent(height)); }

    constructor(width: Length, height: Length) {
        assertParams({ width, height }, [Length]);

        this.__width = width;
        this.__height = height;
    }

    get width(): Length { return this.__width; }
    private __width: Length;

    get height(): Length { return this.__height; }
    private __height: Length;
}

const ZERO = new Point(Length.zero, Length.zero);