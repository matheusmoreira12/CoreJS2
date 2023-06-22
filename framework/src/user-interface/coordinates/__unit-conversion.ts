import { StringUtils } from "../../core-base/utils/index.js";
import { ArgumentException, NotSupportedException } from "../../standard/exceptions/index.js";
import { LengthUnit, Orientation } from "./index.js";

export namespace __UnitConversion {
    function getScreenDPI(): number {
        const div = document.createElement("div");
        div.setAttribute("style", "position: absolute; top: 0; left: 0; width: 1in; height: 1in;");
        document.body.appendChild(div);

        const dpi = div.clientHeight;

        document.body.removeChild(div);

        return dpi;
    }

    const SCREEN_PPI = getScreenDPI();

    function measureText(text: string, element: Element): { width: number, height: number } {
        const div = document.createElement("div");
        div.setAttribute("style", "margin: 0; padding: 0; position: absolute; top: 0; left: 0; width: auto; height: auto; font: inherit;");
        div.textContent = text;
        element.appendChild(div);

        const result = { width: div.clientWidth, height: div.clientHeight };

        element.removeChild(div);

        return result;
    }

    function getEmInPixels(elem: Element): number {
        const mSizePx = measureText("m", elem);
        return mSizePx.height;
    }

    function getExInPixels(elem: Element): number {
        const xSizePx = measureText("x", elem);
        return xSizePx.height;
    }

    function getChInPixels(elem: Element): number {
        const zeroSizePx = measureText("0", elem);
        return zeroSizePx.height;
    }

    function getRemInPixels(): number {
        const mSizePx = measureText("m", document.body);
        return mSizePx.height;
    }

    function getPercentInPixels(elem: Element, orientation: number): number {
        const rect = elem.getBoundingClientRect();
        switch (orientation) {
            case Orientation.Horizontal:
                return rect.width / 100;
            case Orientation.Vertical:
                return rect.height / 100;
            default:
                throw new ArgumentException(StringUtils.nameOf({ orientation }))
        }
    }

    function getViewportSize() {
        const vw = Math.max(document.documentElement.clientWidth, window.innerWidth);
        const vh = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return { width: vw, height: vh };
    }

    function getVwInPixels() {
        const vpSize = getViewportSize();
        return vpSize.width / 10;
    }

    function getVhInPixels() {
        const vpSize = getViewportSize();
        return vpSize.height / 10;
    }

    function getVminInPixels() {
        const vpSize = getViewportSize();
        return Math.min(vpSize.width, vpSize.height) / 10;
    }

    function getVmaxInPixels() {
        const vpSize = getViewportSize();
        return Math.max(vpSize.width, vpSize.height) / 10;
    }

    export function isUnitRelative(unit: number): boolean {
        return unit == LengthUnit.Em ||
            unit == LengthUnit.Ex ||
            unit == LengthUnit.Ch ||
            unit == LengthUnit.Percent;
    }

    export function convert(amount: number, srcUnit: number, destUnit: number, elem?: Element, orientation?: number): number {
        if (srcUnit == destUnit)
            return amount;

        if (srcUnit == LengthUnit.Pixels) {
            switch (destUnit) {
                case LengthUnit.Centimeters:
                    return amount / SCREEN_PPI * 2.54;

                case LengthUnit.Millimeters:
                    return amount / SCREEN_PPI * 25.4;

                case LengthUnit.Inches:
                    return amount / SCREEN_PPI;

                case LengthUnit.Points:
                    return amount / SCREEN_PPI / 72;

                case LengthUnit.Picas:
                    return amount / SCREEN_PPI / 6;

                case LengthUnit.Em:
                    return amount / getEmInPixels(elem!);

                case LengthUnit.Ex:
                    return amount / getExInPixels(elem!);

                case LengthUnit.Ch:
                    return amount / getChInPixels(elem!);

                case LengthUnit.Rem:
                    return amount / getRemInPixels();

                case LengthUnit.Percent:
                    return amount / getPercentInPixels(elem!, orientation!)!;

                case LengthUnit.Vh:
                    return amount / getVhInPixels();

                case LengthUnit.Vw:
                    return amount / getVwInPixels();

                case LengthUnit.Vmin:
                    return amount / getVminInPixels();

                case LengthUnit.Vmax:
                    return amount / getVmaxInPixels();

                default:
                    throw new NotSupportedException("Unit conversion not supported.");
            }
        }

        if (destUnit == LengthUnit.Pixels) {
            switch (srcUnit) {
                case LengthUnit.Centimeters:
                    return amount * SCREEN_PPI / 2.54;

                case LengthUnit.Millimeters:
                    return amount * SCREEN_PPI / 25.4;

                case LengthUnit.Inches:
                    return amount * SCREEN_PPI;

                case LengthUnit.Points:
                    return amount * SCREEN_PPI * 72;

                case LengthUnit.Picas:
                    return amount * SCREEN_PPI * 6;

                case LengthUnit.Em:
                    return amount * getEmInPixels(elem!);

                case LengthUnit.Ex:
                    return amount * getExInPixels(elem!);

                case LengthUnit.Ch:
                    return amount * getChInPixels(elem!);

                case LengthUnit.Rem:
                    return amount * getRemInPixels();

                case LengthUnit.Percent:
                    return amount * getPercentInPixels(elem!, orientation!)!;

                case LengthUnit.Vh:
                    return amount * getVhInPixels();

                case LengthUnit.Vw:
                    return amount * getVwInPixels();

                case LengthUnit.Vmin:
                    return amount * getVminInPixels();

                case LengthUnit.Vmax:
                    return amount * getVmaxInPixels();

                default:
                    throw new NotSupportedException("Unit conversion not supported.");
            }
        }

        return convert(convert(amount, srcUnit, LengthUnit.Pixels, elem, orientation)!, LengthUnit.Pixels, destUnit, elem, orientation);
    }
}