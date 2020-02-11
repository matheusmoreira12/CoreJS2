import { IdentifierGenerator } from "../../CoreBase/index";
import { DependencyProperty } from "./DependencyProperty";
import { PropertyMetadata } from "./PropertyMetadata";
import { DependencyObject } from "./DependencyObject";
import { assertParams } from "../../Validation/index";

const metadata: Map<number, PropertyMetadata> = new Map();

const propertyIDGenerator = new IdentifierGenerator();

export function register(target: typeof DependencyObject, name: string, metadata: PropertyMetadata) {
    assertParams({ name }, String);
    assertParams({ metadata }, PropertyMetadata);

    const id = propertyIDGenerator.generate();
    const property = new DependencyProperty(id);
}