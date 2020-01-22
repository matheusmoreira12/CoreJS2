export class IdentifierGenerator {
    constructor(prefix) {
        this.__usedNumbers = new Set();
        this.__prefix = prefix;
    }

    generate() {
        let number = 0;
        while (this.__usedNumbers.has(number)) number++;
        this.__usedNumbers.add(number);
        return `${this.__prefix}${number}`;
    }

    delete(id) {
        if (!id.startsWith(this.__prefix))
            return false;
        let number = id.replace(this.__prefix, "") * 1;
        this.__usedNumbers.delete(number);
        return true;
    }

    private __usedNumbers: Set<number>;
    private __prefix: string;
}