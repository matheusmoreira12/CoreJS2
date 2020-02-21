export class StringReader {
    constructor(content: string, startIndex: number = 0) {
        this.content = content;
        this.startIndex = startIndex;
        this.index = startIndex;
    }

    next(): string {
        const i = this.index++;
        return this.content[i];
    }

    previous(): string {
        const i = this.index--;
        return this.content[i];
    }

    read(value: string): string {
        let c: string,
            s: string = "";
        for (let i = 0; i < value.length; i++) {
            c = this.next();
            if (c == value[i])
                s += c;
            else
                break;
        }
        return s;
    }

    readBack(value: string): string {
        let c: string,
            s: string = "";
        for (let i = 0; i < value.length; i++) {
            c = this.previous();
            if (c == value[i])
                s = c + s;
            else
                break;
        }
        return s;
    }

    seek(index: number) {
        this.index = index;
    }

    jump(count: number) {
        this.index += count;
    }

    content: string;
    startIndex: number;
    index: number;
}