import { Type } from "../Standard/Types/Type";
import { Class } from "../Standard/Types/Types";
import { Interface } from "../Standard/Interfaces/index";

export type TypeDesignator = undefined | null | Type | Interface | Class<any>;

export type BasicTypeDesignator = undefined | null | Function;

export type Constructor = null | undefined | Class<any>;