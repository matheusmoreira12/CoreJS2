import { HTML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS } from "./html-mapped-tag-names-and-constructors";
import { NativeControl } from "./native-control";

export type HTMLNativeControls = {
    [K in number as typeof HTML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS[K][0]]: NativeControl<typeof HTML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS[K][2]>;
};
