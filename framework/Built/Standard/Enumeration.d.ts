/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export declare class Enumeration<T = number | string> {
    static readonly TYPE_NUMBER: number;
    static readonly TYPE_STRING: number;
    contains(flag: T, value: T): boolean;
    constructor(descriptor: string[] | {
        [key: string]: T;
    });
    toString(value: T): any;
    parse(value: any): string | number;
    private __type;
    private __flags;
}
