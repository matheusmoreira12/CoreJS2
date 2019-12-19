﻿/**
 * ContextSelectionFlags Class
 * Allows the selection of individual flags.*/
export declare class ContextSelectionFlags {
    static [Symbol.species](): StringConstructor;
    static readonly all: ContextSelectionFlags;
    static readonly none: ContextSelectionFlags;
    static parse(str: any): ContextSelectionFlags;
    constructor(includeFlags?: any, requireFlags?: any, excludeFlags?: any);
    toString(): string;
    matchesFlag(flag: any): boolean;
    matches(contextFlags: any): boolean;
    __includeFlags: string[];
    __requireFlags: string[];
    __excludeFlags: string[];
}
