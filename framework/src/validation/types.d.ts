import { Type } from "../standard/reflection/index";
import { ClassOf } from "../standard/reflection/types";
import { Interface } from "../standard/interfaces/index";

export type TypeDesignator = undefined | null | Type | Interface | ClassOf<any>;