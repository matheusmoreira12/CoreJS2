const $takenIDs = Symbol("takenIDs");

export class IdentifierGenerator {
    constructor() {
        this[$takenIDs] = new Set();
    }

    generate() {
        let newID = 0;
        while (this[$takenIDs].has(newID))
            newID++;
        return newID;
    }

    delete(id: number) {
        this[$takenIDs].delete(id);
    }

    private [$takenIDs]: Set<number>;
}