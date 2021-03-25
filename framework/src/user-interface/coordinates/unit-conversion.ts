import { LengthUnit } from "./LengthUnit.js";
import { Orientation } from "./Orientation.js";

function getScreenDPI(): number {
    const div = document.createElement("div");
    div.setAttribute("style", `
position: absolute;
top: 0;
left: 0;
width: 1in;
height: 1in;`);
    document.body.appendChild(div);
    const dpi = div.clientHeight;
    document.body.removeChild(div);
    return dpi;
}

const SCREEN_PPI = getScreenDPI();

function measureText(text: string, element: Element): { width: number, height: number } {
    const div = document.createElement("div");
    div.setAttribute("style", `
position: absolute;
top: 0;
left: 0;
width: auto;
height: auto;
font: inherit;`);
    div.textContent = text;
    element.appendChild(div);
    const result = { width: div.clientWidth, height: div.clientHeight };
    element.removeChild(div);
    return result;
}

function getEmInPx(elem: Element): number {
    const mSizePx = measureText("m", elem);
    return mSizePx.height;
}

function getExInPx(elem: Element): number {
    const xSizePx = measureText("x", elem);
    return xSizePx.height;
}

function getChInPx(elem: Element): number {
    const zeroSizePx = measureText("0", elem);
    return zeroSizePx.height;
}

function getRemInPx() {
    const mSizePx = measureText("m", document.body);
    return mSizePx.height;
}

function getPercentInPx(elem: Element, orientation: number): number | undefined {
    const rect = elem.getBoundingClientRect();
    if (orientation == Orientation.Horizontal)
        return rect.width / 100;
    else if (orientation == Orientation.Vertical)
        return rect.height / 100;
}

function getViewportSize() {
    const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return { width: vw, height: vh };
}

function getVwInPx() {
    const vpSize = getViewportSize();
    return vpSize.width / 10;
}

function getVhInPx() {
    const vpSize = getViewportSize();
    return vpSize.height / 10;
}

function getVminInPx() {
    const vpSize = getViewportSize();
    return Math.min(vpSize.width, vpSize.height) / 10;
}

function getVmaxInPx() {
    const vpSize = getViewportSize();
    return Math.max(vpSize.width, vpSize.height) / 10;
}

export function convert(amount: number, srcUnit: number, destUnit: number, elem?: Element, orientation?: number): number | undefined {
    if (srcUnit == destUnit)
        return amount;
    {
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
                    return amount / getEmInPx(elem!);
                case LengthUnit.Ex:
                    return amount / getExInPx(elem!);
                case LengthUnit.Ch:
                    return amount / getChInPx(elem!);
                case LengthUnit.Rem:
                    return amount / getRemInPx();
                case LengthUnit.Percent:
                    return amount / getPercentInPx(elem!, orientation!)!;
                case LengthUnit.Vh:
                    return amount / getVhInPx();
                case LengthUnit.Vw:
                    return amount / getVwInPx();
                case LengthUnit.Vmin:
                    return amount / getVminInPx();
                case LengthUnit.Vmax:
                    return amount / getVmaxInPx();
            }
        }
        else if (destUnit == LengthUnit.Pixels) {
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
                    return amount * getEmInPx(elem!);
                case LengthUnit.Ex:
                    return amount * getExInPx(elem!);
                case LengthUnit.Ch:
                    return amount * getChInPx(elem!);
                case LengthUnit.Rem:
                    return amount * getRemInPx();
                case LengthUnit.Percent:
                    return amount * getPercentInPx(elem!, orientation!)!;
                case LengthUnit.Vh:
                    return amount * getVhInPx();
                case LengthUnit.Vw:
                    return amount * getVwInPx();
                case LengthUnit.Vmin:
                    return amount * getVminInPx();
                case LengthUnit.Vmax:
                    return amount * getVmaxInPx();
            }
        }
        else {
            return convert(convert(amount, srcUnit, LengthUnit.Pixels, elem, orientation)!, LengthUnit.Pixels, destUnit, elem, orientation);
        }
    }
}