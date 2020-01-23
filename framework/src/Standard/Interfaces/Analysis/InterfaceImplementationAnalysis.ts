import { Type } from "../../Types/index";
import { Interface } from "../index";
import { InterfaceDifference } from "./index";

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