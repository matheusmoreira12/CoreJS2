type GetPropertyName<K extends string> = K extends `on${string}` ? never : K;

export type Properties<T extends typeof Element> = {
    readonly [K in keyof T["prototype"] & string as GetPropertyName<K>] : T["prototype"][K]
};
