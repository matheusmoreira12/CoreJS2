import SourceFile from "./SourceFile";
import Tokenizer from "./Tokenizer";

export default interface Token {
    source: Tokenizer;
    parent: Token;
    start: number;
    end: number;
}