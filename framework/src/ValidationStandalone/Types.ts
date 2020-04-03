import { Class } from "../Standard/Types/Types.js";

export type TypeDesignator = undefined | null | Function;

export type Constructor = null | undefined | Class<any>;

export type AssertionMode = "any" | "all" | "none";