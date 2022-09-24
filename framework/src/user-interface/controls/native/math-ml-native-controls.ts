import { MATH_ML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS } from "./math-ml-mapped-tag-names-and-constructors";
import { NativeControl } from "./native-control";

export type MathMLNativeControls = {
    [K in number as typeof MATH_ML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS[K][0]]: NativeControl<typeof MATH_ML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS[K][2]>;
};
