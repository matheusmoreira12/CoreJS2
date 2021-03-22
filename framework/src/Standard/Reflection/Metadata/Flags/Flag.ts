import { InvalidOperationException } from "../../../Exceptions/index.js";

export abstract class Flag {
    constructor() {
        if (new.target === Flag)
            throw new InvalidOperationException("Invalid constructor.");
    }
}