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
        text: string = "";
    }

    export class BreakToken extends ReservedWordToken {
        text: string = "";
    }

    export class CharToken extends ReservedWordToken {
        text: string = "";
    }

    export class DebuggerToken extends ReservedWordToken {
        text: string = "";
    }

    export class DoubleToken extends ReservedWordToken {
        text: string = "";
    }

    export class ExportToken extends ReservedWordToken {
        text: string = "";
    }

    export class FinallyToken extends ReservedWordToken {
        text: string = "";
    }

    export class GotoToken extends ReservedWordToken {
        text: string = "";
    }

    export class InToken extends ReservedWordToken {
        text: string = "";
    }

    export class LetToken extends ReservedWordToken {
        text: string = "";
    }

    export class NullToken extends ReservedWordToken {
        text: string = "";
    }

    export class PublicToken extends ReservedWordToken {
        text: string = "";
    }

    export class SuperToken extends ReservedWordToken {
        text: string = "";
    }

    export class ThrowToken extends ReservedWordToken {
        text: string = "";
    }

    export class TryToken extends ReservedWordToken {
        text: string = "";
    }

    export class VolatileToken extends ReservedWordToken {
        text: string = "";
    }

    export class ArgumentsToken extends ReservedWordToken {
        text: string = "";
    }

    export class ByteToken extends ReservedWordToken {
        text: string = "";
    }

    export class ClassToken extends ReservedWordToken {
        text: string = "";
    }

    export class DefaultToken extends ReservedWordToken {
        text: string = "";
    }

    export class ElseToken extends ReservedWordToken {
        text: string = "";
    }

    export class ExtendsToken extends ReservedWordToken {
        text: string = "";
    }

    export class FloatToken extends ReservedWordToken {
        text: string = "";
    }

    export class IfToken extends ReservedWordToken {
        text: string = "";
    }

    export class InstanceofToken extends ReservedWordToken {
        text: string = "";
    }

    export class LongToken extends ReservedWordToken {
        text: string = "";
    }

    export class PackageToken extends ReservedWordToken {
        text: string = "";
    }

    export class ReturnToken extends ReservedWordToken {
        text: string = "";
    }

    export class SwitchToken extends ReservedWordToken {
        text: string = "";
    }

    export class ThrowsToken extends ReservedWordToken {
        text: string = "";
    }

    export class TypeofToken extends ReservedWordToken {
        text: string = "";
    }

    export class WhileToken extends ReservedWordToken {
        text: string = "";
    }

    export class AwaitToken extends ReservedWordToken {
        text: string = "";
    }

    export class CaseToken extends ReservedWordToken {
        text: string = "";
    }

    export class ConstToken extends ReservedWordToken {
        text: string = "";
    }

    export class DeleteToken extends ReservedWordToken {
        text: string = "";
    }

    export class EnumToken extends ReservedWordToken {
        text: string = "";
    }

    export class FalseToken extends ReservedWordToken {
        text: string = "";
    }

    export class ForToken extends ReservedWordToken {
        text: string = "";
    }

    export class ImplementsToken extends ReservedWordToken {
        text: string = "";
    }

    export class IntToken extends ReservedWordToken {
        text: string = "";
    }

    export class NativeToken extends ReservedWordToken {
        text: string = "";
    }

    export class PrivateToken extends ReservedWordToken {
        text: string = "";
    }

    export class ShortToken extends ReservedWordToken {
        text: string = "";
    }

    export class SynchronizedToken extends ReservedWordToken {
        text: string = "";
    }

    export class TransientToken extends ReservedWordToken {
        text: string = "";
    }

    export class VarToken extends ReservedWordToken {
        text: string = "";
    }

    export class WithToken extends ReservedWordToken {
        text: string = "";
    }

    export class BooleanToken extends ReservedWordToken {
        text: string = "";
    }

    export class CatchToken extends ReservedWordToken {
        text: string = "";
    }

    export class ContinueToken extends ReservedWordToken {
        text: string = "";
    }

    export class DoToken extends ReservedWordToken {
        text: string = "";
    }

    export class EvalToken extends ReservedWordToken {
        text: string = "";
    }

    export class FinalToken extends ReservedWordToken {
        text: string = "";
    }

    export class FunctionToken extends ReservedWordToken {
        text: string = "";
    }

    export class ImportToken extends ReservedWordToken {
        text: string = "";
    }

    export class InterfaceToken extends ReservedWordToken {
        text: string = "";
    }

    export class NewToken extends ReservedWordToken {
        text: string = "";
    }

    export class ProtectedToken extends ReservedWordToken {
        text: string = "";
    }

    export class StaticToken extends ReservedWordToken {
        text: string = "";
    }

    export class ThisToken extends ReservedWordToken {
        text: string = "";
    }

    export class TrueToken extends ReservedWordToken {
        text: string = "";
    }

    export class VoidToken extends ReservedWordToken {
        text: string = "";
    }

    export class YieldToken extends ReservedWordToken {
        text: string = "";
    }

    export abstract class OperatorToken extends FixedTextToken {
        abstract priority: number;
    }
}