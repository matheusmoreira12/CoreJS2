export namespace MathX {
    export function orderMag(value: number): number {
        const exponent = Math.log10(value),
            order = Math.trunc(exponent);
        return order;
    }

    export function pow10(exponent: number): number {
        return Math.pow(10, exponent);
    }

    export function decimals(value: number, decimalPlaces: number): number {
        const multiplier = MathX.pow10(decimalPlaces);
        return Math.trunc(value * multiplier % multiplier);
    }

    export function round(value: number, decimalPlaces: number = 0): number {
        let multiplier = MathX.pow10(decimalPlaces);
        return Math.round(value * multiplier) / multiplier;
    }

    export function limitToBounds(value: number, min: number, max: number): number {
        return Math.max(min, Math.min(max, value));
    }

    export function isBetween(value: number, floor: number, ceiling: number) {
        return value >= floor && value <= ceiling;
    }

    export function mid(...values: number[]): number {
        function distMiddle(value: number): number {
            return Math.abs(value - middle);
        }

        const middle = (Math.min(...values) + Math.max(...values)) / 2;
        const nearestToHalf = values.sort((a, b) => distMiddle(a) - distMiddle(b));

        return nearestToHalf[0];
    }

    export function sigma(z: number, n: number): number {
        if (z == 0)
            return getDivisors(n).reduce((r, d) => r + d, 0);
        return getDivisors(n).map(d => Math.pow(d, z)).reduce((r, d) => r + d, 0);
    }

    export function getDivisors(value: number): number[] {
        if (value == 0)
            return [];
        if (value < 0)
            return getDivisors(-value).map(d => -d);
        return [...generateDivisors()].sort((a, b) => sign(a - b));

        function* generateDivisors() {
            for (let i = 1; i <= Math.sqrt(value); i++) {
                if (value % i == 0) {
                    yield i;
                    if (i != value / i)
                        yield value / i;
                }
            }
        }
    }

    export function sign(value: number) {
        return value > 0 ? 1 : value < 0 ? -1 : 0;
    }
}