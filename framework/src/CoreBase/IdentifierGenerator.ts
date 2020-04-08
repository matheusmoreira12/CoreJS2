const $takenIDs = Symbol("takenIDs");

function randomizeId(id: number): BigInt {
    const rdm = crypto.getRandomValues(new Uint16Array(1))[0];
    const rdmBig = BigInt(rdm);
    const idBig = BigInt(id);
    let result = 0n;
    for (let i = 0n; i < 32n; i++) {
        const idBit = (idBig >> i) & 1n,
            rdmBit = (rdmBig >> i) & 1n;
        result = result | idBit << (i * 2n) | rdmBit << (i * 2n + 1n);
    }
    return result;
}

function derandomizeId(id: bigint) {
    let resultBig = 0n;
    for (let i = 0n; i < 32n; i++) {
        const idBit = id >> (i * 2n) & 1n;
        resultBig = resultBig | (idBit << i);
    }
    return Number(resultBig);
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