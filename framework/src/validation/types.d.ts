import { Type, ClassOf } from "../standard/reflection/index";
import { Interface } from "../standard/interfaces/index";

export type TypeDesignator = undefined | null | Type | Interface | ClassOf<any>;