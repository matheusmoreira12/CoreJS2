import Tokenizer from "./Tokenizer";

export default class Token {
    constructor(model: TokenModel, source: Tokenizer, start: number, end: number, parent?: Token, children?: (Token)[]) {
        this.model = model;
        this.source = source;
        this.start = start;
        this.end = end;
        this.parent = parent === undefined ? null : parent;
        this.children = children === undefined ? null : [];
    }

    model: TokenModel;
    source: Tokenizer;
    start: number;
    end: number;
    parent: Token;
    children: Token[];

    getText() {
        return this.source.inputText.slice(this.start, this.end);
    }
}

export class TokenModel {
    constructor(text: string);
    constructor(children: TokenModel[]);
    constructor(arg: string | TokenModel[]) {
        if (typeof arg === "string")
            this.text = arg;
        else if (arg instanceof Array)
            this.children = arg;
        else
            throw "The specified parameter value is invalid.";
    }

    emit(source: Tokenizer): Token {

    }

    take(token: Token) {

    }

    text: string = null;
    children: TokenModel[] = [];
}