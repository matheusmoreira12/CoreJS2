import { Length } from "./length.js";
import { assertParams } from "../../validation/index.js";

export class Size {
    static get zero(): Size { return ZERO };

    static getCentimeters(width: number, height: number): Size { return new Size(Length.getCentimeters(width), Length.getCentimeters(height)); }

    static getMillimeters(width: number, height: number): Size { return new Size(Length.getMillimeters(width), Length.getMillimeters(height)); }

    static getInches(width: number, height: number): Size { return new Size(Length.getInches(width), Length.getInches(height)); }

    static getPixels(width: number, height: number): Size { return new Size(Length.getPixels(width), Length.getPixels(height)); }

    static getPoints(width: number, height: number): Size { return new Size(Length.getPoints(width), Length.getPoints(height)); }

    static getPicas(width: number, height: number): Size { return new Size(Length.getPicas(width), Length.getPicas(height)); }

    static getEm(width: number, height: number): Size { return new Size(Length.getEm(width), Length.getEm(height)); }

    static getEx(width: number, height: number): Size { return new Size(Length.getEx(width), Length.getEx(height)); }

    static getCh(width: number, height: number): Size { return new Size(Length.getCh(width), Length.getCh(height)); }

    static getRem(width: number, height: number): Size { return new Size(Length.getRem(width), Length.getRem(height)); }

    static getVw(width: number, height: number): Size { return new Size(Length.getVw(width), Length.getVw(height)); }

    static getVh(width: number, height: number): Size { return new Size(Length.getVh(width), Length.getVh(height)); }

    static getVmin(width: number, height: number): Size { return new Size(Length.getVmin(width), Length.getVmin(height)); }

    static getVmax(width: number, height: number): Size { return new Size(Length.getVmax(width), Length.getVmax(height)); }

    static getPercent(width: number, height: number): Size { return new Size(Length.getPercent(width), Length.getPercent(height)); }

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

const ZERO = new Size(Length.zero, Length.zero);