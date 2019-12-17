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

export enum TokenModelType {
    Text,
    Structured,
    Custom
}

export class TokenModel {
    constructor(text: string);
    constructor(children: TokenModel[]);
    constructor(emit: (source: Tokenizer) => Token, take: (token: Token, dest: Tokenizer) => void);
    constructor(...args: any[]) {
        if (args.length == 1) {
            if (typeof args[0] == "string") {
                this.text = args[0];
                this.type = TokenModelType.Text;
            }
            else if (args[0] instanceof Array) {
                this.children = args[0];
                this.type = TokenModelType.Structured;
            }
            else
                throw "Invalid value for argument args[0]. A value of type String or Array was expected.";
        }
        else if (args.length == 2) {
            if (typeof args[0] == "function")
                this.emit = args[0];
            else
                throw "Invalid value for argument args[0]. A value of type Function was expected.";
            if (typeof args[1] == "function")
                this.take = args[1];
            else
                throw "Invalid value for argument args[1]. A value of type Function was expected.";
            this.type = TokenModelType.Custom;
        }
        else
            throw "The number of specified parameters is invalid.";
    }

    emit: (source: Tokenizer) => Token = null;
    take: (token: Token, dest: Tokenizer) => void = null;
    text: string = null;
    children: TokenModel[] = [];
    type: TokenModelType;
}