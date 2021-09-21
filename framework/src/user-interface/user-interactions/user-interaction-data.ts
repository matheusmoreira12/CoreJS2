import { InvalidOperationException } from "../../standard/exceptions/index.js";

export abstract class UserInteractionData {
    constructor() {
        if (new.target === UserInteractionData)
            throw new InvalidOperationException("Invalid Constructor.");
    }
}
