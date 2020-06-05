import { InvalidOperationException } from "../../../Exceptions/index.js";

export abstract class Attribute {
    constructor() {
        if (new.target === Attribute)
            throw new InvalidOperationException("Invalid constructor.");
    }
}