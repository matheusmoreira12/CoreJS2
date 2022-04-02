import { Type } from "../reflection/index";
import { InstanceOf, TypeMatchingConstraint } from "../reflection/types";
import { DependencyProperty, PropertyMetadata } from "./index";

export type ValueType = TypeMatchingConstraint | null;

type MetadataFromProperty<TProperty> = TProperty extends DependencyProperty<any, any, infer TMetadata> ? TMetadata : never;

type ValueTypeFromMetadata<TMetadata> = TMetadata extends PropertyMetadata<infer TValue> ? TValue : never;

export type JSTypeFromValueType<TType extends ValueType> = TType extends Type<infer TJSType> ? InstanceOf<TJSType> : any;