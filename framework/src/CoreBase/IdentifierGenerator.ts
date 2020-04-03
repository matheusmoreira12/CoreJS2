const $takenIDs = Symbol("takenIDs");

function randomizeId(id: number) {
    const id0 = id & 0xFF,
        id1 = id >> 8 & 0xFF;
    const rdm = new Uint8Array(2);
    crypto.getRandomValues(rdm);
    return Math.abs(id0 | rdm[0] << 8 | id1 << 16 | rdm[1] << 24);
}

function derandomizeId(id: number) {
    const id0 = id & 0xFF,
        id2 = id >> 16 & 0xFF;
    return Math.abs(id0 | id2 << 8);
}

export class IdentifierGenerator {
    constructor() {
        this[$takenIDs] = new Set();
    }

    generate() {
        let id = 0;
        while (this[$takenIDs].has(id))
            id++;
        this[$takenIDs].add(id);
        id = randomizeId(id);
        return id;
    }

    delete(id: number) {
        id = derandomizeId(id);
        this[$takenIDs].delete(id);
    }

    private [$takenIDs]: Set<number>;
}