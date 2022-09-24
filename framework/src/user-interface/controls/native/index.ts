import { HTML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS } from "./html-mapped-tag-names-and-constructors.js";
import { MATH_ML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS } from "./math-ml-mapped-tag-names-and-constructors.js";
import { SVG_MAPPED_TAG_NAMES_AND_CONSTRUCTORS } from "./svg-mapped-tag-names-and-constructors.js";
import { __Generator } from "./__generator.js";
import { HTMLNativeControls } from "./html-native-controls";
import { SVGNativeControls } from "./svg-native-controls";
import { MathMLNativeControls } from "./math-ml-native-controls";

export * from "./native-control-base.js";

export const HTML = __Generator.generateNativeControls(HTML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS) as HTMLNativeControls;

export const SVG = __Generator.generateNativeControls(SVG_MAPPED_TAG_NAMES_AND_CONSTRUCTORS) as SVGNativeControls;

export const MathML = __Generator.generateNativeControls(MATH_ML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS) as MathMLNativeControls;