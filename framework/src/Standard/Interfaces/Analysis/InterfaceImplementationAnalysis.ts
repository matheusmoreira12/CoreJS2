import { Type } from "../../Reflection/index.js";
import { Interface } from "../index.js";
import { InterfaceDifference } from "./index.js";

export class InterfaceImplementationAnalysis {
    constructor(analizedType: Type, analizedInterface: Interface, ...differences: InterfaceDifference[]) {
        this.__analizedType = analizedType;
        this.__analizedInterface = analizedInterface;
        this.__differences = differences;
    }

    get analizedType() { return this.__analizedType; }
    private __analizedType: Type;

    get analizedInterface() { return this.__analizedInterface; }
    private __analizedInterface: Interface;

    get differences() { return this.__differences; }
    private __differences: InterfaceDifference[];

    get isEmpty() { return this.__differences.length == 0 };
}