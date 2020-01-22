declare const MathX: {
    orderMag(value: number): number;
    pow10(exponent: number): number;
    decimals(value: number, decimalPlaces: number): number;
    round(value: number, decimalPlaces?: number): number;
    limitToBounds(value: number, min: number, max: number): number;
    isBetween(value: number, floor: number, ceiling: number): boolean;
    mid(...values: number[]): number;
};
export default MathX;
