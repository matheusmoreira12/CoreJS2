import { TokenModel } from "./Token.js";
export declare type Constructor<T> = (...args: any) => T;
export declare type Class<T> = {
    constructor: Constructor<T>;
    prototype: Object;
};
export default class Tokenizer {
    constructor(inputText: string, tokenModels: TokenModel[]);
    inputText: string;
    tokenModels: TokenModel[];
}
