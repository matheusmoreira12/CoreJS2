import { MapUtils } from "../../core-base/utils/index.js";
import { assert } from "../../validation/index.js";
import { IValueConverter } from "./index.js";

export class MappedValueConverter<TSource> implements IValueConverter {
    constructor(map: Map<TSource, string>);
    constructor(arr: [[TSource, string]]);
    constructor(mapOrArr: Map<TSource, string> | [[TSource, string]]) {
        assert({ mapOrArr }, [Map, Array]);

        if (mapOrArr instanceof Map)
            this.__map = mapOrArr;
        else
            this.__map = new Map(mapOrArr);
    }

    convert(value: TSource | null): string | null {
        if (value == null)
            return null;

        return this.__map.get(value) ?? "";
    }

    convertBack(value: string | null): TSource | null {
        if (value == null)
            return null;

        return MapUtils.invert(this.__map).get(value) ?? null
    }

    private __map: Map<TSource, string>;
}