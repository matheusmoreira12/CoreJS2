/**
 * ContextSelectionFlags Class
 * Allows the selection of individual flags.*/
export declare class ContextSelectionFlags {
    static [Symbol.species](): StringConstructor;
    static get all(): ContextSelectionFlags;
    static get none(): ContextSelectionFlags;
    static parse(value: string): ContextSelectionFlags | null;
    constructor(includeFlags?: string[], requireFlags?: string[], excludeFlags?: string[]);
    toString(): string;
    matchesFlag(flag: string): boolean;
    matches(contextFlags: ContextSelectionFlags): boolean;
    __includeFlags: string[];
    __requireFlags: string[];
    __excludeFlags: string[];
}
