import { NameOf } from "./name-of";
import { NameOfMap } from "./name-of-map";

function normalizeCase(value: string) {
    return value.replace(/\w[A-Z]/g, m => m[0] + " " + m[1]).toLowerCase().replace(/_/g, " ").replace(/-/g, " ");
}

export namespace StringUtils {
    export function* getCharRange(start: string[1], end: string[1]) {
        const j = start.charCodeAt(0),
            k = end.charCodeAt(0);
        for (var i = j; i <= k; i++)
            yield String.fromCharCode(i);
    }

    export function isNumericChar(char: string[1]) {
        return char && NUMERIC_CHARS.indexOf(char) != -1;
    }

    export function isLowerCaseLetter(char: string[1]) {
        return char && LOWER_CASE_LETTER_CHARS.indexOf(char) != -1;
    }

    export function isUpperCaseLetter(char: string[1]) {
        return char && UPPER_CASE_LETTER_CHARS.indexOf(char) != -1;
    }

    export function isLetter(char: string[1]) {
        return char && LETTER_CHARS.indexOf(char) != -1;
    }

    export function isWordChar(char: string[1]) {
        return char && WORD_CHARS.indexOf(char) != -1;
    }

    export function format(format: string, ...values: any[]) {
        const ARGUMENT_PATTERN = /\{(\d+?)\}/g;
        const formattedString = format.replace(ARGUMENT_PATTERN, (_sub, index) =>
            String(values[Number(index)]));
        return formattedString;
    }

    export function formatSet(format: string, set: Set<any>) {
        set = set || new Set();
        return StringUtils.format(format, ...Array.from(set));
    }

    export function formatMap(format: string, map: Map<any, any> | WeakMap<any, any>) {
        const ARGUMENT_PATTERN = /\{"(\w+?)"\}/g;
        const formattedString = format.replace(ARGUMENT_PATTERN, (_sub, name) =>
            String(map.get(name)));
        return formattedString;
    }

    export function formatObject(format: string, obj: Map<any, any> | WeakMap<any, any>) {
        const ARGUMENT_PATTERN = /\{"(\w+?)"\}/g;
        const formattedString = format.replace(ARGUMENT_PATTERN, (_sub, name) =>
            String(obj[<keyof typeof obj>name]));
        return formattedString;
    }

    export function toHyphenCase(value: string) {
        const normalized = normalizeCase(value);
        return normalized.replace(/ /g, "-");
    }

    export function toUpperHyphenCase(value: string) {
        return toHyphenCase(value).toUpperCase();
    }

    export function toUnderscoreCase(value: string) {
        const normalized = normalizeCase(value);
        return normalized.replace(/ /g, "_")
    }

    export function toUpperUnderscoreCase(value: string) {
        return toUnderscoreCase(value).toUpperCase();
    }

    export function toCammelCase(value: string) {
        const normalized = normalizeCase(value);
        return normalized.replace(/ \w/g, m => m[1].toUpperCase());
    }

    export function nameOf<TNameOfMap extends NameOfMap>(map: TNameOfMap): NameOf<TNameOfMap> {
        return String(Object.keys(map)[0]);
    }

    export const NUMERIC_CHARS = [...getCharRange("0", "9")];
    export const LOWER_CASE_LETTER_CHARS = [...getCharRange("a", "z")];
    export const UPPER_CASE_LETTER_CHARS = [...getCharRange("A", "Z")];
    export const LETTER_CHARS = [...LOWER_CASE_LETTER_CHARS, ...UPPER_CASE_LETTER_CHARS];
    export const WORD_CHARS = [...NUMERIC_CHARS, ...LETTER_CHARS, "_"];
}