import Tokenizer, { Class } from "../Tokens/Tokenizer";
import Token from "../Tokens/Token";

export default class SourceFile implements Tokenizer  {
    constructor() {

    }

    inputText: string;
    acceptedTokens: Class<Token>[];
}