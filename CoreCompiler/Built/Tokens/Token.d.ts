import Tokenizer from "./Tokenizer";
export default class Token {
    constructor(model: TokenModel, source: Tokenizer, start: number, end: number, parent?: Token, children?: (Token)[]);
    model: TokenModel;
    source: Tokenizer;
    start: number;
    end: number;
    parent: Token;
    children: Token[];
    getText(): string;
}
export declare enum TokenModelType {
    Text = 0,
    Structured = 1,
    Custom = 2
}
export declare class TokenModel {
    constructor(text: string);
    constructor(children: TokenModel[]);
    constructor(emit: (source: Tokenizer) => Token, take: (token: Token, dest: Tokenizer) => void);
    emit: (source: Tokenizer) => Token;
    take: (token: Token, dest: Tokenizer) => void;
    text: string;
    children: TokenModel[];
    type: TokenModelType;
}
