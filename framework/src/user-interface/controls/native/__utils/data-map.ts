export type DataMap = { readonly [name: string]: DataMapItem; };

export type DataMapItem = { namespaceUri: string, ctorName: string };