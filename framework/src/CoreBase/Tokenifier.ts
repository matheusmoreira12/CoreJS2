export class Tokenifier {
    constructor(content: string, startIndex: number = 0) {
        this.content = content;
        this.startIndex = startIndex;
        this.currentIndex = startIndex;
    }

    next(): string {
        const i = this.currentIndex++;
        return this.content[i];
    }

    previous(): string {
        const i = this.currentIndex--;
        return this.content[i];
    }

    readChar(char: string): boolean {
        if (this.next() == char) {
            return true;
        }
        return false;
    }

    read(value: string): string {
        let s = "";
        for (let i = 0; i < value.length; i++)
            if (!this.readChar(value[i]))
                return this.content.slice(j, i);
        return "";
    }

    readBack(value: string) {
    }

    content: string;
    startIndex: number;
    currentIndex: number;
}