import { Length } from "./index.js";

export class Rectangle {
    static getCentimeters(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getCentimeters(left), Length.getCentimeters(top), Length.getCentimeters(width), Length.getCentimeters(height)); }

    static getMillimeters(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getMillimeters(left), Length.getMillimeters(top), Length.getMillimeters(width), Length.getMillimeters(height)); }

    static getInches(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getInches(left), Length.getInches(top), Length.getInches(width), Length.getInches(height)); }

    static getPixels(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getPixels(left), Length.getPixels(top), Length.getPixels(width), Length.getPixels(height)); }

    static getPoints(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getPoints(left), Length.getPoints(top), Length.getPoints(width), Length.getPoints(height)); }

    static getPicas(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getPicas(left), Length.getPicas(top), Length.getPicas(width), Length.getPicas(height)); }

    static getEm(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getEm(left), Length.getEm(top), Length.getEm(width), Length.getEm(height)); }

    static getEx(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getEx(left), Length.getEx(top), Length.getEx(width), Length.getEx(height)); }

    static getCh(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getCh(left), Length.getCh(top), Length.getCh(width), Length.getCh(height)); }

    static getRem(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getRem(left), Length.getRem(top), Length.getRem(width), Length.getRem(height)); }

    static getVw(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getVw(left), Length.getVw(top), Length.getVw(width), Length.getVw(height)); }

    static getVh(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getVh(left), Length.getVh(top), Length.getVh(width), Length.getVh(height)); }

    static getVmin(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getVmin(left), Length.getVmin(top), Length.getVmin(width), Length.getVmin(height)); }

    static getVmax(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getVmax(left), Length.getVmax(top), Length.getVmax(width), Length.getVmax(height)); }

    static getPercent(left: number, top: number, width: number, height: number): Rectangle { return new Rectangle(Length.getPercent(left), Length.getPercent(top), Length.getPercent(width), Length.getPercent(height)); }

    constructor(left: Length, top: Length, width: Length, height: Length) {
        this.#left = left;
        this.#top = top;
        this.#width = width;
        this.#height = height;
    }

    get left(): Length { return this.#left; }
    #left: Length;

    get top(): Length { return this.#top; }
    #top: Length;

    get width(): Length { return this.#width; }
    #width: Length;

    get height(): Length { return this.#height; }
    #height: Length;
}
