import { InvalidOperationException } from "../exceptions/index.js";

export abstract class CompositionBase {
    constructor() {
        if (new.target === CompositionBase)
            throw new InvalidOperationException("Invalid constructor.");
    }
}
