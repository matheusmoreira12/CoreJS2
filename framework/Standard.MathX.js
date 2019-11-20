export const MathX = {
    orderMag(value) {
        const exponent = Math.log10(value),
            order = Math.trunc(exponent);
        return order;
    },

    round(value, decimalPlaces = 0) {
        let magnitude = Math.pow(10, decimalPlaces);
        return Math.round(value * magnitude) / magnitude;
    }
};