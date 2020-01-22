import { Type } from "../../Types/index.js";
import { Interface } from "../index.js";
export declare class InterfaceDifference {
    constructor(analizedType: Type, analizedInterface: Interface, propertyKey: string | number | symbol, differenceType: number);
    get analizedType(): Type;
    private __analizedType;
    get analizedInterface(): Interface;
    private __analizedInterface;
    get propertyKey(): string | number | symbol;
    private __propertyKey;
    get differenceType(): number;
    private __differenceType;
}
