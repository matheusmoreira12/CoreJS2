export const MathX = {
    round(value, decimalPlaces = 0) {
        let magnitude = Math.pow(10, decimalPlaces);
        return Math.round(value * magnitude) / magnitude;
    }
};