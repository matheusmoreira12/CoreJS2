import { Type } from "../../Types/index.js";
import { Interface } from "../index.js";
import { InterfaceDifference } from "./index.js";
export declare class InterfaceImplementationAnalysis {
    constructor(analizedType: Type, analizedInterface: Interface, ...differences: InterfaceDifference[]);
    get analizedType(): Type<any>;
    private __analizedType;
    get analizedInterface(): Interface;
    private __analizedInterface;
    get differences(): InterfaceDifference[];
    private __differences;
    get isEmpty(): boolean;
}
