import { ControlConstructor } from "../control-constructor";
import { HTMLNativeControls } from "./html-native-controls";
import { ArrayUtils } from "../../../core-base/utils/index.js";
import { Control } from "../index.js";
import { EXCLUDED_PROPERTIES } from "./excluded-properties.js";
import { DependencyProperty, PropertyMetadata } from "../../../standard/dependency-objects/index.js";
import { NativeControlBase } from "./native-control-base.js";
import { HTML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS } from "./html-mapped-tag-names-and-constructors.js";
import { SVG_MAPPED_TAG_NAMES_AND_CONSTRUCTORS } from "./svg-mapped-tag-names-and-constructors.js";
import { MATH_ML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS } from "./math-ml-mapped-tag-names-and-constructors.js";
import { SVGNativeControls } from "./svg-native-controls";
import { MathMLNativeControls } from "./math-ml-native-controls";

export namespace __Generator {
    export function generateNativeControls(arr: typeof HTML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS | typeof SVG_MAPPED_TAG_NAMES_AND_CONSTRUCTORS | typeof MATH_ML_MAPPED_TAG_NAMES_AND_CONSTRUCTORS): HTMLNativeControls | SVGNativeControls | MathMLNativeControls {
        const result = {};
        for (let [elementName, namespaceUri, ctor] of arr) {
            const nativeControl = nativeControlFactory(elementName) as unknown as ControlConstructor;
            Control.register(nativeControl, elementName, namespaceUri);
            const propNames = ArrayUtils.excludeMany(Object.getOwnPropertyNames(ctor.prototype), EXCLUDED_PROPERTIES);
            for (let propName of propNames) {
                Object.defineProperty(nativeControl.prototype, propName, {
                    get() { return this.get(prop); },
                    set(value: any) { return this.set(prop, value); }
                });
                const prop = DependencyProperty.registerAttached(nativeControl, propName, new PropertyMetadata(null, null));
                Object.defineProperty(nativeControl, `${propName}Property`, {
                    get() { return prop; }
                });
            }
            Object.defineProperty(result, elementName, {
                get() { return nativeControl; }
            });
        }
        return result as HTMLNativeControls;
    }

    function nativeControlFactory(tagName: string): NativeControlBase {
        return new Function("NativeControlBase", `return class ${tagName}_NativeControl extends NativeControlBase {};`)(NativeControlBase)
    }
}