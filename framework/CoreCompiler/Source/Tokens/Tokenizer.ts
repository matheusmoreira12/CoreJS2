import Token, { TokenModel } from "./Token";

export type Constructor<T> = (...args: any) => T;
export type Class<T> = { constructor: Constructor<T>, prototype: Object };

export default class Tokenizer {
    constructor(inputText: string, tokenModels: TokenModel[]) {
        this.inputText = inputText;
        this.tokenModels = tokenModels;
    }

    inputText: string;
    tokenModels: TokenModel[];
}