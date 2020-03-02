export class StringReader {
    constructor(content: string, startIndex: number = 0) {
        this.content = content;
        this.startIndex = startIndex;
        this.index = startIndex;
    }

    peek(): string {
        return this.content[this.index];
    }

    read(): string {
        const j = this.index;
        this.index++;
        return this.content[j];
    }

    readBlock(buffer: string[], index: number, count: number): number {
        let c: string,
            n: number = 0;
        const a: string[] = [];
        do {
            c = this.read();
            a.push(c);
            n++;
        }
        while (c && n < count);
        buffer.splice(index, n, ...a);
        return n;
    }

    readLine(): string {
        const a: string[] = [],
            n = getNextLine(this.content, this.index) - this.index;
        this.readBlock(a, 0, n);
        return a.join("");
    }

    readToEnd(): string {
        const a: string[] = [],
            n = this.content.length - this.index;
        this.readBlock(a, 0, n);
        return a.join("");
    }

    content: string;
    startIndex: number;
    index: number;
}

function getNextLine(content: string, position: number): number {
    let i = content.indexOf("\n", position);
    if (i == -1)
        return content.length - 1;
    else
        return i;
}