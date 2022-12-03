export type PropertySymbol<T> = keyof T & symbol;

export type PropertyName<T> = keyof T & string;

export type AllPropertyDescriptorsMap<T> = PropertyDescriptorMap & (T extends (null | undefined) ? {} : { [K in keyof T]: TypedPropertyDescriptor<T[K]> });

export type AllPropertyDescriptorsAsTuples<T> = T extends (null | undefined) ? IterableIterator<never> : IterableIterator<[target: T, key: keyof T, descriptor: TypedPropertyDescriptor<T[keyof T]>]>;

export type OwnPropertyDescriptorsAsTuples<T> = T extends (null | undefined) ? IterableIterator<never> : IterableIterator<[key: keyof T, descriptor: TypedPropertyDescriptor<T[keyof T]>]>;

export type Tuplified<T> = IterableIterator<[keyof T & string, T[keyof T & string]]>;

export type Detuplified<T> = T extends IterableIterator<[infer Ks, infer Vs]> ? { [K in Ks & string]: Vs } : {};