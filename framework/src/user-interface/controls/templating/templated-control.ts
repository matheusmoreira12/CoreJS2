import { Collection, Dictionary } from "../../../standard/collections/index.js";
import { DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { Type } from "../../../standard/reflection/index.js";
import { assertParams } from "../../../validation/index.js";

export class TemplatedControl {
    constructor(type: Type) {
        assertParams({ type }, [Type]);

        this.#type = type;
    }

    public get type(): Type { return this.#type; }
    #type: Type;

    public get propertyValues(): Dictionary<DependencyProperty, object> { return this.#propertyValues; }
    #propertyValues: Dictionary<DependencyProperty, object> = new Dictionary();

    public get children(): Collection<TemplatedControl> { return this.#children; }
    #children: Collection<TemplatedControl> = new Collection();
}