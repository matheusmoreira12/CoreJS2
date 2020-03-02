import { assertParams, assertEachParams } from "../../Validation/index";
import { ArgumentOutOfRangeException } from "../Exceptions";

const $content = Symbol();
const $index = Symbol();

export class StringReader {
    constructor(content: string) {
        assertParams({ content }, String);

        this[$content] = content;
        this[$index] = 0;
    }

    peek(): string {
        return this[$content][this[$index]];
    }

    read(): string {
        const char = this.peek();
        this[$index]++;
        return char;
    }

    readBlock(buffer: string[], index: number, count: number): number {
        assertEachParams({ buffer }, Array, String);
        assertParams({ index, count }, Number);

        if (index < 0 || index > buffer.length - 1)
            throw new ArgumentOutOfRangeException("index");
        if (count < 0)
            throw new ArgumentOutOfRangeException("count");

        let char: string,
            readCount: number = 0;
        const readChars: string[] = [];
        do {
            char = this.read();
            readChars.push(char);
            readCount++;
        }
        while (char && readCount < count);
        buffer.splice(index, readCount, ...readChars);
        return readCount;
    }

    readLine(): string {
        const readChars: string[] = [],
            lineEnd = findLineEnd(this[$content], this[$index]);
        this.readBlock(readChars, 0, lineEnd - this[$index]);
        return readChars.join("");
    }

    readToEnd(): string {
        const readChars: string[] = [],
            endOfFile = this[$content].length;
        this.readBlock(readChars, 0, endOfFile - this[$index]);
        return readChars.join("");
    }

    private [$content]: string;
    private [$index]: number;
}

function findLineEnd(content: string, position: number): number {
    let i = content.indexOf("\n", position);
    if (i == -1)
        return content.length - 1;
    else
        return i;
}