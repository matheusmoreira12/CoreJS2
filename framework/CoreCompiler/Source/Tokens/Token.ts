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
    constructor(emit: (source: Tokenizer) => Token, take: (token: Token, dest: Tokenizer) => void);
    constructor(...args: any[]) {
        if (args.length == 1) {
            if (typeof args[0] == "string")
                this.text = args[0];
            else
                throw "Invalid value for argument \"text\". A value of type String was expected.";
        }
        else if (args.length == 2) {
            if (typeof args[0] == "function")
                this.emit = args[0];
            else
                throw "Invalid value for argument \"emit\". A value of type Function was expected.";
            if (typeof args[1] == "function")
                this.take = args[1];
            else
                throw "Invalid value for argument \"take\". A value of type Function was expected.";
        }
        else
            throw "The number of specified parameters is invalid.";
    }

    emit: (source: Tokenizer) => Token = null;
    take: (token: Token, dest: Tokenizer) => void = null;
    text: string = null;
    children: TokenModel[] = [];
}