const $content = Symbol("content");
const $index = Symbol("index");

export class StringReader {
    constructor(content: string) {
        this[$content] = content;
        this[$index] = 0;
    }

    peek(): string {
        const peekedChars: string[] = [];
        if (this.copyBlock(peekedChars, 0, 1) > 0)
            return peekedChars[0];
        else
            return "";
    }

    read(): string {
        const readChars: string[] = [];
        if (this.readBlock(readChars, 0, 1) > 0)
            return readChars[0];
        else
            return "";
    }

    copyBlock(buffer: string[], index: number, count: number): number {
        const start = this[$index],
            endOfFile = this[$content].length,
            endOfBlock = this[$index] + count,
            end = Math.min(endOfFile, endOfBlock),
            copyCount = end - start;

        if (copyCount > 0) {
            const readChars: string[] = [...this[$content].slice(start, end)];
            buffer.splice(index, copyCount, ...readChars);
        }

        return copyCount;
    }

    readBlock(buffer: string[], index: number, count: number): number {
        const readCount = this.copyBlock(buffer, index, count);
        this[$index] += readCount;
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
            endOfFile = this[$content].length - 1;
        this.readBlock(readChars, 0, endOfFile - this[$index]);
        return readChars.join("");
    }

    private [$content]: string;
    private [$index]: number;
}

function findLineEnd(content: string, offset: number): number {
    let i = content.indexOf("\n", offset);
    if (i == -1)
        return content.length - 1;
    else
        return i;
}