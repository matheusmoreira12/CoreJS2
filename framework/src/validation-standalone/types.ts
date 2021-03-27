import { ClassOf } from "../standard/reflection/types.js";

export type TypeDesignator = undefined | null | Function;

export type Constructor = null | undefined | ClassOf<any>;

export type AssertionMode = "any" | "all" | "none";