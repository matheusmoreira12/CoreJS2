import Token from "./Token";

export type Constructor<T> = (...args: any) => T;
export type Class<T> = { constructor: Constructor<T>, prototype: Object };

export default interface Tokenizer {
    inputText: string;
    acceptedTokens: Class<Token>[];
}