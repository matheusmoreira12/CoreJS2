import { DependencyProperty } from "../../../standard/dependency-objects/dependency-property.js";
import { Control } from "../index.js";

type AllElements = { [K in Exclude<keyof (typeof globalThis), "Element" | "HTMLElement" | "SVGElement" | "MathMLElement"> as (typeof globalThis)[K] extends (typeof Element) ? K : never]: (typeof globalThis)[K] };

type AllNativeControls = { [K in keyof AllElements]: NativeControlCtor<AllElements[K]> };

type NativeControl<T extends typeof Element> = Control & { [K in keyof T["prototype"] & string]: T["prototype"][K] };
type NativeControlCtor<T extends typeof Element> = { new(): NativeControl<T>, prototype: NativeControl<T> } & { [K in keyof T["prototype"] & string as `__${K}_property`]: DependencyProperty };

const HTML_NAMESPACE_URI = "http://www.w3.org/1999/xhtml";
const SVG_NAMESPACE_URI = "http://www.w3.org/2000/svg";

const ELEMENT_CONSTRUCTOR_NAME_MAP: Map<typeof Element, { elementName: string, elementNamespaceURI?: string }> = new Map([
    // [Element, { elementName: "" }]
]);

export const Native: AllNativeControls = generateAllNativeControls();

function generateAllNativeControls(): AllNativeControls {
    throw new Error("Function not implemented.");
}