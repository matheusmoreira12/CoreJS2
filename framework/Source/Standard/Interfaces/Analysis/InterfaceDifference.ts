import { Type } from "../../Types/index.js";
import { Interface } from "../index.js";

export class InterfaceDifference {
    constructor(analizedType: Type, analizedInterface: Interface, propertyKey: string | number | symbol, differenceType: number) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__propertyKey = propertyKey;
        this.__differenceType = differenceType;
    }

    get analizedType(): Type { return this.__analizedType; }
    private __analizedType: Type;

    get analizedInterface(): Interface { return this.__analizedInterface; }
    private __analizedInterface: Interface;

    get propertyKey(): string | number | symbol { return this.__propertyKey; }
    private __propertyKey: string | number | symbol;

    get differenceType(): number { return this.__differenceType; }
    private __differenceType: number;
}