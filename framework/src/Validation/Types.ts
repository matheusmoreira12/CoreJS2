import { Type } from "../Standard/Reflection/Type.js";
import { Class } from "../Standard/Reflection/Types.js";
import { Interface } from "../Standard/Interfaces/index.js";

export type TypeDesignator = undefined | null | Type | Interface | Class<any>;

export type BasicTypeDesignator = undefined | null | Function;

export type Constructor = null | undefined | Class<any>;