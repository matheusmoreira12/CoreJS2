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

    export abstract class WhitespaceToken implements Token {
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
    }

    export abstract class ReservedWordToken extends FixedTextToken {
    }

    export class AbstractToken extends ReservedWordToken {
        text: string = "abstract";
    }

    export class BreakToken extends ReservedWordToken {
        text: string = "break";
    }

    export class CharToken extends ReservedWordToken {
        text: string = "char";
    }

    export class DebuggerToken extends ReservedWordToken {
        text: string = "debugger";
    }

    export class DoubleToken extends ReservedWordToken {
        text: string = "double";
    }

    export class ExportToken extends ReservedWordToken {
        text: string = "export";
    }

    export class FinallyToken extends ReservedWordToken {
        text: string = "finally";
    }

    export class GotoToken extends ReservedWordToken {
        text: string = "goto";
    }

    export class InToken extends ReservedWordToken {
        text: string = "in";
    }

    export class LetToken extends ReservedWordToken {
        text: string = "let";
    }

    export class NullToken extends ReservedWordToken {
        text: string = "null";
    }

    export class PublicToken extends ReservedWordToken {
        text: string = "public";
    }

    export class SuperToken extends ReservedWordToken {
        text: string = "super";
    }

    export class ThrowToken extends ReservedWordToken {
        text: string = "throw";
    }

    export class TryToken extends ReservedWordToken {
        text: string = "try";
    }

    export class VolatileToken extends ReservedWordToken {
        text: string = "volatile";
    }

    export class ArgumentsToken extends ReservedWordToken {
        text: string = "arguments";
    }

    export class ByteToken extends ReservedWordToken {
        text: string = "byte";
    }

    export class ClassToken extends ReservedWordToken {
        text: string = "class";
    }

    export class DefaultToken extends ReservedWordToken {
        text: string = "default";
    }

    export class ElseToken extends ReservedWordToken {
        text: string = "else";
    }

    export class ExtendsToken extends ReservedWordToken {
        text: string = "extends";
    }

    export class FloatToken extends ReservedWordToken {
        text: string = "float";
    }

    export class IfToken extends ReservedWordToken {
        text: string = "if";
    }

    export class InstanceofToken extends ReservedWordToken {
        text: string = "instanceof";
    }

    export class LongToken extends ReservedWordToken {
        text: string = "long";
    }

    export class PackageToken extends ReservedWordToken {
        text: string = "package";
    }

    export class ReturnToken extends ReservedWordToken {
        text: string = "return";
    }

    export class SwitchToken extends ReservedWordToken {
        text: string = "switch";
    }

    export class ThrowsToken extends ReservedWordToken {
        text: string = "throws";
    }

    export class TypeofToken extends ReservedWordToken {
        text: string = "typeof";
    }

    export class WhileToken extends ReservedWordToken {
        text: string = "while";
    }

    export class AwaitToken extends ReservedWordToken {
        text: string = "await";
    }

    export class CaseToken extends ReservedWordToken {
        text: string = "case";
    }

    export class ConstToken extends ReservedWordToken {
        text: string = "const";
    }

    export class DeleteToken extends ReservedWordToken {
        text: string = "delete";
    }

    export class EnumToken extends ReservedWordToken {
        text: string = "enum";
    }

    export class FalseToken extends ReservedWordToken {
        text: string = "false";
    }

    export class ForToken extends ReservedWordToken {
        text: string = "for";
    }

    export class ImplementsToken extends ReservedWordToken {
        text: string = "implements";
    }

    export class IntToken extends ReservedWordToken {
        text: string = "int";
    }

    export class NativeToken extends ReservedWordToken {
        text: string = "native";
    }

    export class PrivateToken extends ReservedWordToken {
        text: string = "private";
    }

    export class ShortToken extends ReservedWordToken {
        text: string = "short";
    }

    export class SynchronizedToken extends ReservedWordToken {
        text: string = "synchronized";
    }

    export class TransientToken extends ReservedWordToken {
        text: string = "transient";
    }

    export class VarToken extends ReservedWordToken {
        text: string = "var";
    }

    export class WithToken extends ReservedWordToken {
        text: string = "with";
    }

    export class BooleanToken extends ReservedWordToken {
        text: string = "boolean";
    }

    export class CatchToken extends ReservedWordToken {
        text: string = "catch";
    }

    export class ContinueToken extends ReservedWordToken {
        text: string = "continue";
    }

    export class DoToken extends ReservedWordToken {
        text: string = "do";
    }

    export class EvalToken extends ReservedWordToken {
        text: string = "eval";
    }

    export class FinalToken extends ReservedWordToken {
        text: string = "final";
    }

    export class FunctionToken extends ReservedWordToken {
        text: string = "function";
    }

    export class ImportToken extends ReservedWordToken {
        text: string = "import";
    }

    export class InterfaceToken extends ReservedWordToken {
        text: string = "interface";
    }

    export class NewToken extends ReservedWordToken {
        text: string = "new";
    }

    export class ProtectedToken extends ReservedWordToken {
        text: string = "protected";
    }

    export class StaticToken extends ReservedWordToken {
        text: string = "static";
    }

    export class ThisToken extends ReservedWordToken {
        text: string = "this";
    }

    export class TrueToken extends ReservedWordToken {
        text: string = "true";
    }

    export class VoidToken extends ReservedWordToken {
        text: string = "void";
    }

    export class YieldToken extends ReservedWordToken {
        text: string = "yield";
    }

    export abstract class OperatorToken extends FixedTextToken {
        abstract priority: number;
    }
}