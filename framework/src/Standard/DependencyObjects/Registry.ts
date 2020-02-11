import { IdentifierGenerator } from "../../CoreBase/index";
import { DependencyProperty } from "./DependencyProperty";
import { PropertyMetadata } from "./PropertyMetadata";
import { DependencyObject } from "./DependencyObject";
import { assertParams } from "../../Validation/index";
import { Interface } from "../Interfaces/index";
import { Type } from "../Types/index";

const propertyIDGenerator = new IdentifierGenerator();

export function register(target: typeof DependencyObject, name: string, metadata: PropertyMetadata) {
    assertParams({ target }, Interface.extract(DependencyObject));
    assertParams({ name }, String);
    assertParams({ metadata }, PropertyMetadata);

    const id = propertyIDGenerator.generate();
    const property = new DependencyProperty(id);
}