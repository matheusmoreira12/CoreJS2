import { Collection } from "../../../standard/collections/index.js";
import { DependencyObject } from "../../../standard/dependency-objects/index.js";
import { InvalidOperationException } from "../../../standard/exceptions/index.js"
import { assertParams } from "../../../validation/index.js";
import { ResourceDictionary } from "../../resources/index.js";
import { Trigger } from "../../triggers/index.js";
import { TemplatedControl } from "./index.js";

export abstract class FrameworkTemplate extends DependencyObject {
    constructor() {
        super();

        if (new.target === FrameworkTemplate)
            throw new InvalidOperationException("Invalid contructor.");
    }

    public get resources(): ResourceDictionary { return this.#resources; }
    #resources = new ResourceDictionary();

    public get triggers(): Collection<Trigger> { return this.#triggers; }
    #triggers = new Collection<Trigger>();

    public get visualTree(): TemplatedControl | null { return this.#visualTree; };
    public set visualTree(value: TemplatedControl | null) {
        assertParams({ value }, [TemplatedControl, null]);

        this.#visualTree = value;
    }
    #visualTree: TemplatedControl | null = null;
}