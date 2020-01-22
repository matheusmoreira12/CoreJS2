declare type ExplicitEnumerationDescriptor = {
    [key: string]: number;
};
declare type ImplicitEnumerationDescriptor = string[];
export declare type EnumerationDescriptor = ExplicitEnumerationDescriptor | ImplicitEnumerationDescriptor;
/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export declare class Enumeration {
    contains(flag: number, value: number): boolean;
    constructor(descriptor: EnumerationDescriptor);
    getLabel(value: number): string | null;
    fromLabel(label: string): number;
    private __flagsMap;
}
export {};
