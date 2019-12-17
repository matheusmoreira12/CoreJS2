/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export declare class Enumeration {
    static intersect(value1: any, value2: any): number;
    static valuesIntersect(value1: any, value2: any): boolean;
    static isFlagSet(flag: any, value: any): boolean;
    static contains(value1: any, value2: any): boolean;
    constructor(descriptorMap: any);
    convertToString(value: any): unknown;
    convertFromString(value: any): number;
    getAsMap(): Map<unknown, unknown>;
}
