import { HTML_ELEMENT_DATA_MAP } from "./__utils/html-element-data-map.js";
import { MATH_ML_ELEMENT_DATA_MAP } from "./__utils/math-ml-element-data-map.js";
import { SVG_ELEMENT_DATA_MAP } from "./__utils/svg-element-data-map.js";
import { __Generator } from "./__generator.js";
import { NativeControls } from "./__utils/native-controls.js";

export * from "./native-control-base.js";

export const HTML = __Generator.generateNativeControls(HTML_ELEMENT_DATA_MAP) as NativeControls<typeof HTML_ELEMENT_DATA_MAP>;

export const SVG = __Generator.generateNativeControls(SVG_ELEMENT_DATA_MAP) as NativeControls<typeof SVG_ELEMENT_DATA_MAP>;

export const MathML = __Generator.generateNativeControls(MATH_ML_ELEMENT_DATA_MAP) as NativeControls<typeof MATH_ML_ELEMENT_DATA_MAP>;