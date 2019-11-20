export const MathX = {
    magnitude(value) {
        const exponent = Math.log10(value),
            magnitude = Math.pow(10, Math.trunc(exponent));
        return magnitude;
    },

    round(value, decimalPlaces = 0) {
        let magnitude = Math.pow(10, decimalPlaces);
        return Math.round(value * magnitude) / magnitude;
    }
};