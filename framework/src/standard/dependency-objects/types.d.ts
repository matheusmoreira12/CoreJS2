import { Interface } from "../interfaces/index";
import { ClassOf, InstanceOf, Type, TypeMatchingConstraint } from "../reflection/index";
import { TypeConstraint } from "../reflection/type-constraints/type-constraint";
import { DependencyProperty, PropertyMetadata } from "./index";

export type ValueType = TypeMatchingConstraint | null;

type MetadataFromProperty<TProperty> = TProperty extends DependencyProperty<any, any, infer TMetadata> ? TMetadata : never;

type ValueTypeFromMetadata<TMetadata> = TMetadata extends PropertyMetadata<infer TValue> ? TValue : never;

export type JSTypeFromValueType<TType extends ValueType> = TType extends Type<infer TJSType> ? InstanceOf<TJSType> : any;