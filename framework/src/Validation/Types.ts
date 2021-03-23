import { Type } from "../Standard/Reflection/Type.js";
import { ClassOf } from "../Standard/Reflection/Types.js";
import { Interface } from "../Standard/Interfaces/index.js";

export type TypeDesignator = undefined | null | Type | Interface | ClassOf<object>;

export type BasicTypeDesignator = undefined | null | Function;

export type Constructor = null | undefined | ClassOf<any>;