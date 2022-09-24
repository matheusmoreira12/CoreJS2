import { SVG_MAPPED_TAG_NAMES_AND_CONSTRUCTORS } from "./svg-mapped-tag-names-and-constructors";
import { NativeControl } from "./native-control";

export type SVGNativeControls = {
    [K in number as typeof SVG_MAPPED_TAG_NAMES_AND_CONSTRUCTORS[K][0]]: NativeControl<typeof SVG_MAPPED_TAG_NAMES_AND_CONSTRUCTORS[K][2]>;
};
