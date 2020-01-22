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

export const NUMERIC_CHARS = [...getCharRange("0", "9")];
export const LOWER_CASE_LETTER_CHARS = [...getCharRange("a", "z")];
export const UPPER_CASE_LETTER_CHARS = [...getCharRange("A", "Z")];
export const LETTER_CHARS = [...LOWER_CASE_LETTER_CHARS, ...UPPER_CASE_LETTER_CHARS];
export const WORD_CHARS = [...NUMERIC_CHARS, ...LETTER_CHARS, "_"];