import { DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { Control } from "../index.js";

type GlobalThis = typeof globalThis;

type AllElements = { [K in Exclude<keyof GlobalThis, ExcludedElementNames> as GlobalThis[K] extends (typeof Element) ? K : never]: GlobalThis[K] };

type AllNativeControls = { [K in keyof AllElements]: NativeControlConstructor<AllElements[K]> };

type NativeControlConstructor<T extends typeof Element> = { new(): NativeControl<T>, prototype: NativeControl<T> } & { [K in AllPropertiesOfPrototype<T> as `${K}_property` ]: DependencyProperty };

type NativeControl<T extends typeof Element> = Control & { [K in AllPropertiesOfPrototype<T>]: T["prototype"][K] };

type AllPropertiesOfPrototype<T extends typeof Element> = Exclude<keyof T["prototype"] & string, NativeControlExcludedProperties>;

type ExcludedElementNames = typeof EXCLUDED_ELEMENT_NAMES[number];

const EXCLUDED_ELEMENT_NAMES = ["Element", "HTMLElement", "SVGElement", "MathMLElement", "Audio", "Source", "Image", "Option", "opener"] as const;

type NativeControlExcludedProperties = typeof NATIVE_CONTROL_EXCLUDED_PROPERTIES[number];

const NATIVE_CONTROL_EXCLUDED_PROPERTIES: readonly (keyof HTMLElement | keyof SVGElement | keyof MathMLElement)[] = ["ATTRIBUTE_NODE", "CDATA_SECTION_NODE", "COMMENT_NODE", "DOCUMENT_FRAGMENT_NODE", "DOCUMENT_NODE", "DOCUMENT_POSITION_CONTAINED_BY", "DOCUMENT_POSITION_CONTAINS", "DOCUMENT_POSITION_DISCONNECTED", "DOCUMENT_POSITION_FOLLOWING", "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC", "DOCUMENT_POSITION_PRECEDING", "DOCUMENT_TYPE_NODE", "ELEMENT_NODE", "ENTITY_NODE", "ENTITY_REFERENCE_NODE", "NOTATION_NODE", "PROCESSING_INSTRUCTION_NODE", "TEXT_NODE"] as const;

const XHTML_NAMESPACE_URI = "http://www.w3.org/1999/xhtml";
const SVG_NAMESPACE_URI = "http://www.w3.org/2000/svg";
const MATHML_NAMESPACE_URI = "http://www.w3.org/1998/Math/MathML";

const NATIVE_CONTROL_DATA_MAPPING: readonly (readonly [keyof AllElements, { elementName: string, elementNamespaceURI: string }])[] = [
    // ["HTMLHtmlElement", { elementName: "html", elementNamespaceURI: XHTML_NAMESPACE_URI }],
] as const;

export const Native: AllNativeControls = generateAllNativeControls();

function generateAllNativeControls(): AllNativeControls {
    throw new Error("Function not implemented.");
}