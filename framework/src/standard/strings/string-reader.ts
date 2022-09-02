
export class StringReader {
    constructor(content: string) {
        this.__content = content;
        this.__index = 0;
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
        const start = this.__index,
            endOfFile = this.__content.length,
            endOfBlock = this.__index + count,
            end = Math.min(endOfFile, endOfBlock),
            copyCount = end - start;

        if (copyCount > 0) {
            const readChars: string[] = [...this.__content.slice(start, end)];
            buffer.splice(index, copyCount, ...readChars);
        }

        return copyCount;
    }

    readBlock(buffer: string[], index: number, count: number): number {
        const readCount = this.copyBlock(buffer, index, count);
        this.__index += readCount;
        return readCount;
    }

    readLine(): string {
        const readChars: string[] = [],
            lineEnd = findLineEnd(this.__content, this.__index);
        this.readBlock(readChars, 0, lineEnd - this.__index);
        return readChars.join("");
    }

    readToEnd(): string {
        const readChars: string[] = [],
            endOfFile = this.__content.length - 1;
        this.readBlock(readChars, 0, endOfFile - this.__index);
        return readChars.join("");
    }

    private __content: string;
    private __index: number;
}

function findLineEnd(content: string, offset: number): number {
    let i = content.indexOf("\n", offset);
    if (i == -1)
        return content.length - 1;
    else
        return i;
}