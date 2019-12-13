import Tokenizer from "../Tokens/Tokenizer";
import Token from "../Tokens/Token";

export namespace Tokens {
    export abstract class FixedTextToken implements Token {
        constructor(source: Tokenizer, parent: Token, start: number, end: number) {
            this.source = source;
            this.parent = parent;
            this.start = start;
            this.end = end;
        }

        source: Tokenizer;
        parent: Token;
        start: number;
        end: number;

        abstract text: string;
    }

    export class CommaToken extends FixedTextToken {
        text = ",";
    }

    export class CommaToken extends FixedTextToken {
        text = ",";
    }

    export class CommaToken extends FixedTextToken {
        text = ",";
    }

    export class CommaToken extends FixedTextToken {
        text = ",";
    }

    export class CommaToken extends FixedTextToken {
        text = ",";
    }
}