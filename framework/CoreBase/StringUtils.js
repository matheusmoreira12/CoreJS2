export const StringUtils = {
    *getCharRange(start, end) {
        const j = start.charCodeAt(0),
            k = end.charCodeAt(0);
        for (var i = j; i <= k; i++)
            yield String.fromCharCode(i);
    }
};