import { OutputArgument } from "../reflection/types";

export class StringReader {
    constructor(content: string) {
        this.__content = content;
        this.__index = 0;
    }

    peek(outChar: OutputArgument<string>): number {
        const cs: string[] = new Array(1);
        const l = this.peekBlock(cs, 0, 1);
        if (l > 0)
            outChar.value = cs[0];
        return l;
    }

    read(outChar: OutputArgument<string>): number {
        const cs: string[] = new Array(1);
        const l = this.readBlock(cs, 0, 1);
        if (l > 0)
            outChar.value = cs[0];
        return l;
    }

    peekBlock(buffer: string[], index: number, count: number): number {
        const i = this.__index;
        const er = this.__index + count;
        const ef = this.__content.length;
        const eb = i + buffer.length;
        const e = eb < ef ? eb < er ? eb : er : ef;
        const l = e - i;
        if (l > 0) {
            const cs = Array.from(this.__content).slice(i, e);
            buffer.splice(index, l, ...cs);
        }
        return l;
    }

    readBlock(buffer: string[], index: number, count: number): number {
        const l = this.peekBlock(buffer, index, count);
        this.__index += l;
        return l;
    }

    readLine(): string {
        const readChars: string[] = [],
            lineEnd = this.getEndOfLine();
        this.readBlock(readChars, 0, lineEnd - this.__index);
        return readChars.join("");
    }

    getEndOfLine(): number {
        let el = this.__content.indexOf("\n", this.__index);
        if (el == -1)
            return this.__content.length;
        return el;
    }

    readRest(buffer: string[]): number {
        const ef = this.__content.length - 1;
        return this.readBlock(buffer, 0, ef - this.__index);
    }

    get isEOF(): boolean {
        return this.__index >= this.__content.length;
    }

    private __content: string;
    private __index: number;
}