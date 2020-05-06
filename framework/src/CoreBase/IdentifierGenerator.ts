
function randomizeId(id: number): bigint {
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
        this.__takenIDs = new Set();
    }

    generate(): bigint {
        let id = 0;
        while (this.__takenIDs.has(id))
            id++;
        this.__takenIDs.add(id);
        const bigId = randomizeId(id);
        return bigId;
    }

    delete(id: bigint) {
        const idNum = derandomizeId(id);
        this.__takenIDs.delete(idNum);
    }

    private __takenIDs: Set<number>;
}