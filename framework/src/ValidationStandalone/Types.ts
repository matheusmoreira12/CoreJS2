import { ClassOf } from "../Standard/Reflection/Types.js";

export type TypeDesignator = undefined | null | Function;

export type Constructor = null | undefined | ClassOf<any>;

export type AssertionMode = "any" | "all" | "none";