import { HTML_ELEMENT_DATA_TUPLES } from "./html-element-data-tuples.js";
import { MATH_ML_ELEMENT_DATA_TUPLES } from "./math-ml-element-data-tuples.js";
import { SVG_ELEMENT_DATA_TUPLES } from "./svg-element-data-tuples.js";
import { __Generator } from "./__generator.js";
import { NativeControls } from "./native-controls";

export * from "./native-control-base.js";

export const HTML = __Generator.generateNativeControls(HTML_ELEMENT_DATA_TUPLES) as NativeControls<typeof HTML_ELEMENT_DATA_TUPLES>;

export const SVG = __Generator.generateNativeControls(SVG_ELEMENT_DATA_TUPLES) as NativeControls<typeof SVG_ELEMENT_DATA_TUPLES>;

export const MathML = __Generator.generateNativeControls(MATH_ML_ELEMENT_DATA_TUPLES) as NativeControls<typeof MATH_ML_ELEMENT_DATA_TUPLES>;