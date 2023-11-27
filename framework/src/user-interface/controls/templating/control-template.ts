import { FrameworkException } from "../../../standard/exceptions/framework-exception.js";
import { Type } from "../../../standard/reflection/index.js";
import { assertParams } from "../../../validation/index.js";
import { FrameworkTemplate } from "./framework-template.js";

export class ControlTemplate extends FrameworkTemplate {
    constructor(targetType: Type) {
        super();

        assertParams({ targetType }, [Type]);

        this.#targetType = targetType;
        return;
    }

    get targetType(): Type { return this.#targetType; }
    #targetType: Type;
}