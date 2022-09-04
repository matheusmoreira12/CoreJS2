import { InvalidOperationException } from "../exceptions/index.js";

export abstract class Composable {
    constructor() {
        if (new.target === Composable)
            throw new InvalidOperationException("Invalid constructor.");
    }
}
