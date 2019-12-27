const MathX = {
    orderMag(value) {
        const exponent = Math.log10(value), order = Math.trunc(exponent);
        return order;
    },
    pow10(exponent) {
        return Math.pow(10, exponent);
    },
    decimals(value, decimalPlaces) {
        const multiplier = this.pow10(decimalPlaces);
        return Math.trunc(value * multiplier % multiplier);
    },
    round(value, decimalPlaces = 0) {
        let multiplier = this.pow10(decimalPlaces);
        return Math.round(value * multiplier) / multiplier;
    }
};
export default MathX;
