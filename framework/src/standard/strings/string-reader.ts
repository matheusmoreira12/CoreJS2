import { OutputArgument } from "../reflection/types";

export class StringReader {
    constructor(content: string) {
        this.#content = content;
        this.#position = 0;
    }

    peek(): string | null {
        const cs: string[] = new Array(1);
        const l = this.peekBlock(cs, 0, 1);
        if (l > 0)
            return cs[0];
        return null;
    }

    read(): string | null {
        const cs: string[] = new Array(1);
        const l = this.readBlock(cs, 0, 1);
        if (l > 0)
            return cs[0];
        return null;
    }

    skip(): number {
        if (this.isEOF)
            return 0;
        this.#position++;
        return 1;
    }

    jump(count: number): number {
        const l = this.length;
        const i = this.position;
        const fc = count <= l - i ? count : l - i;
        this.#position += fc;
        return fc;
    }

    seek(position: number): number {
        const l = this.length;
        const fp = position >= 0 ? position <= l ? position : l : 0;
        this.#position = fp;
        return fp;
    }

    peekBlock(buffer: string[], index: number, count: number): number {
        const i = this.#position;
        const er = this.#position + count;
        const ef = this.#content.length;
        const eb = i + buffer.length;
        const e = eb < ef ? eb < er ? eb : er : ef;
        const l = e - i;
        if (l > 0) {
            const cs = Array.from(this.#content).slice(i, e);
            buffer.splice(index, l, ...cs);
        }
        return l;
    }

    readBlock(buffer: string[], index: number, count: number): number {
        const l = this.peekBlock(buffer, index, count);
        this.jump(l);
        return l;
    }

    readLine(): string {
        const readChars: string[] = [],
            lineEnd = this.getEndOfLine();
        this.readBlock(readChars, 0, lineEnd - this.#position);
        return readChars.join("");
    }

    getEndOfLine(): number {
        let el = this.#content.indexOf("\n", this.#position);
        if (el == -1)
            return this.#content.length;
        return el;
    }

    readRest(buffer: string[]): number {
        const ef = this.#content.length - 1;
        return this.readBlock(buffer, 0, ef - this.#position);
    }

    get isEOF(): boolean {
        return this.#position >= this.#content.length;
    }

    get position(): number {
        return this.#position;
    }
    #position: number;

    get length(): number {
        return this.#content.length;
    }
    
    #content: string;
}