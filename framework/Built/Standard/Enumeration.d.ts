export declare type EnumerationValue = number | string | boolean | bigint;
export declare type EnumerationDescriptor<T> = Array<string> | {
    [key: string]: T;
};
/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export declare class Enumeration<T = EnumerationValue> {
    static readonly TYPE_NUMBER: number;
    static readonly TYPE_STRING: number;
    static readonly TYPE_BOOLEAN: number;
    static readonly TYPE_BIGINT: number;
    contains(flag: T, value: T): boolean;
    constructor(descriptor: string[] | {
        [key: string]: T;
    });
    toString(value: T): any;
    parse(value: any): string | number;
    private __type;
    private __flags;
}
