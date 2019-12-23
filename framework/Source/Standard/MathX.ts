const MathX = {
    orderMag(value: number): number {
        const exponent = Math.log10(value),
            order = Math.trunc(exponent);
        return order;
    },

    pow10(exponent: number): number {
        return Math.pow(10, exponent);
    },

    decimals(value: number, decimalPlaces: number): number {
        const multiplier = this.pow10(decimalPlaces);
        return Math.trunc(value * multiplier % multiplier);
    },

    round(value: number, decimalPlaces: number = 0): number {
        let multiplier = this.pow10(decimalPlaces);
        return Math.round(value * multiplier) / multiplier;
    }
};
export default MathX;