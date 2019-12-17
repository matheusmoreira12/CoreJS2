export class IdentifierGenerator {
    constructor(prefix) {
        this._usedNumbers = new Set();
        this._prefix = prefix;
    }
    generate() {
        let number = 0;
        while (this._usedNumbers.has(number))
            number++;
        this._usedNumbers.add(number);
        return `${this._prefix}${number}`;
    }
    delete(id) {
        if (!id.startsWith(this._prefix))
            return false;
        let number = id.replace(this._prefix, "") * 1;
        this._usedNumbers.delete(number);
        return true;
    }
}
