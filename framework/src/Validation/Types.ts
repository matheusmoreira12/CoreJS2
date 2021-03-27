import { Type } from "../standard/reflection/type.js";
import { ClassOf } from "../standard/reflection/types.js";
import { Interface } from "../standard/interfaces/index.js";

export type TypeDesignator = undefined | null | Type | Interface | ClassOf<object>;

export type BasicTypeDesignator = undefined | null | Function;

export type Constructor = null | undefined | ClassOf<any>;