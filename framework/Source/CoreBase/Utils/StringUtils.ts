const StringUtils = {
    *getCharRange(start, end) {
        const j = start.charCodeAt(0),
            k = end.charCodeAt(0);
        for (var i = j; i <= k; i++)
            yield String.fromCharCode(i);
    },

    isNumericChar(char) {
        return char && NUMERIC_CHARS.indexOf(char) != -1;
    },

    isLowerCaseLetter(char) {
        return char && LOWER_CASE_LETTER_CHARS.indexOf(char) != -1;
    },

    isUpperCaseLetter(char) {
        return char && UPPER_CASE_LETTER_CHARS.indexOf(char) != -1;
    },

    isLetter(char) {
        return char && LETTER_CHARS.indexOf(char) != -1;
    },

    isWordChar(char) {
        return char && WORD_CHARS.indexOf(char) != -1;
    }
};
export default StringUtils;

export const NUMERIC_CHARS = [...StringUtils.getCharRange("0", "9")];
export const LOWER_CASE_LETTER_CHARS = [...StringUtils.getCharRange("a", "z")];
export const UPPER_CASE_LETTER_CHARS = [...StringUtils.getCharRange("A", "Z")];
export const LETTER_CHARS = [...LOWER_CASE_LETTER_CHARS, ...UPPER_CASE_LETTER_CHARS];
export const WORD_CHARS = [...NUMERIC_CHARS, ...LETTER_CHARS, "_"];