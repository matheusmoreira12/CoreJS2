"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Tokens;
(function (Tokens) {
    var FixedTextToken = /** @class */ (function () {
        function FixedTextToken(source, parent, start, end) {
            this.source = source;
            this.parent = parent;
            this.start = start;
            this.end = end;
        }
        return FixedTextToken;
    }());
    Tokens.FixedTextToken = FixedTextToken;
    var WhitespaceToken = /** @class */ (function () {
        function WhitespaceToken(source, parent, start, end) {
            this.source = source;
            this.parent = parent;
            this.start = start;
            this.end = end;
        }
        return WhitespaceToken;
    }());
    Tokens.WhitespaceToken = WhitespaceToken;
    var ReservedWordToken = /** @class */ (function (_super) {
        __extends(ReservedWordToken, _super);
        function ReservedWordToken() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return ReservedWordToken;
    }(FixedTextToken));
    Tokens.ReservedWordToken = ReservedWordToken;
    var AbstractToken = /** @class */ (function (_super) {
        __extends(AbstractToken, _super);
        function AbstractToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "abstract";
            return _this;
        }
        return AbstractToken;
    }(ReservedWordToken));
    Tokens.AbstractToken = AbstractToken;
    var BreakToken = /** @class */ (function (_super) {
        __extends(BreakToken, _super);
        function BreakToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "break";
            return _this;
        }
        return BreakToken;
    }(ReservedWordToken));
    Tokens.BreakToken = BreakToken;
    var CharToken = /** @class */ (function (_super) {
        __extends(CharToken, _super);
        function CharToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "char";
            return _this;
        }
        return CharToken;
    }(ReservedWordToken));
    Tokens.CharToken = CharToken;
    var DebuggerToken = /** @class */ (function (_super) {
        __extends(DebuggerToken, _super);
        function DebuggerToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "debugger";
            return _this;
        }
        return DebuggerToken;
    }(ReservedWordToken));
    Tokens.DebuggerToken = DebuggerToken;
    var DoubleToken = /** @class */ (function (_super) {
        __extends(DoubleToken, _super);
        function DoubleToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "double";
            return _this;
        }
        return DoubleToken;
    }(ReservedWordToken));
    Tokens.DoubleToken = DoubleToken;
    var ExportToken = /** @class */ (function (_super) {
        __extends(ExportToken, _super);
        function ExportToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "export";
            return _this;
        }
        return ExportToken;
    }(ReservedWordToken));
    Tokens.ExportToken = ExportToken;
    var FinallyToken = /** @class */ (function (_super) {
        __extends(FinallyToken, _super);
        function FinallyToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "finally";
            return _this;
        }
        return FinallyToken;
    }(ReservedWordToken));
    Tokens.FinallyToken = FinallyToken;
    var GotoToken = /** @class */ (function (_super) {
        __extends(GotoToken, _super);
        function GotoToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "goto";
            return _this;
        }
        return GotoToken;
    }(ReservedWordToken));
    Tokens.GotoToken = GotoToken;
    var InToken = /** @class */ (function (_super) {
        __extends(InToken, _super);
        function InToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "in";
            return _this;
        }
        return InToken;
    }(ReservedWordToken));
    Tokens.InToken = InToken;
    var LetToken = /** @class */ (function (_super) {
        __extends(LetToken, _super);
        function LetToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "let";
            return _this;
        }
        return LetToken;
    }(ReservedWordToken));
    Tokens.LetToken = LetToken;
    var NullToken = /** @class */ (function (_super) {
        __extends(NullToken, _super);
        function NullToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "null";
            return _this;
        }
        return NullToken;
    }(ReservedWordToken));
    Tokens.NullToken = NullToken;
    var PublicToken = /** @class */ (function (_super) {
        __extends(PublicToken, _super);
        function PublicToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "public";
            return _this;
        }
        return PublicToken;
    }(ReservedWordToken));
    Tokens.PublicToken = PublicToken;
    var SuperToken = /** @class */ (function (_super) {
        __extends(SuperToken, _super);
        function SuperToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "super";
            return _this;
        }
        return SuperToken;
    }(ReservedWordToken));
    Tokens.SuperToken = SuperToken;
    var ThrowToken = /** @class */ (function (_super) {
        __extends(ThrowToken, _super);
        function ThrowToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "throw";
            return _this;
        }
        return ThrowToken;
    }(ReservedWordToken));
    Tokens.ThrowToken = ThrowToken;
    var TryToken = /** @class */ (function (_super) {
        __extends(TryToken, _super);
        function TryToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "try";
            return _this;
        }
        return TryToken;
    }(ReservedWordToken));
    Tokens.TryToken = TryToken;
    var VolatileToken = /** @class */ (function (_super) {
        __extends(VolatileToken, _super);
        function VolatileToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "volatile";
            return _this;
        }
        return VolatileToken;
    }(ReservedWordToken));
    Tokens.VolatileToken = VolatileToken;
    var ArgumentsToken = /** @class */ (function (_super) {
        __extends(ArgumentsToken, _super);
        function ArgumentsToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "arguments";
            return _this;
        }
        return ArgumentsToken;
    }(ReservedWordToken));
    Tokens.ArgumentsToken = ArgumentsToken;
    var ByteToken = /** @class */ (function (_super) {
        __extends(ByteToken, _super);
        function ByteToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "byte";
            return _this;
        }
        return ByteToken;
    }(ReservedWordToken));
    Tokens.ByteToken = ByteToken;
    var ClassToken = /** @class */ (function (_super) {
        __extends(ClassToken, _super);
        function ClassToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "class";
            return _this;
        }
        return ClassToken;
    }(ReservedWordToken));
    Tokens.ClassToken = ClassToken;
    var DefaultToken = /** @class */ (function (_super) {
        __extends(DefaultToken, _super);
        function DefaultToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "default";
            return _this;
        }
        return DefaultToken;
    }(ReservedWordToken));
    Tokens.DefaultToken = DefaultToken;
    var ElseToken = /** @class */ (function (_super) {
        __extends(ElseToken, _super);
        function ElseToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "else";
            return _this;
        }
        return ElseToken;
    }(ReservedWordToken));
    Tokens.ElseToken = ElseToken;
    var ExtendsToken = /** @class */ (function (_super) {
        __extends(ExtendsToken, _super);
        function ExtendsToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "extends";
            return _this;
        }
        return ExtendsToken;
    }(ReservedWordToken));
    Tokens.ExtendsToken = ExtendsToken;
    var FloatToken = /** @class */ (function (_super) {
        __extends(FloatToken, _super);
        function FloatToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "float";
            return _this;
        }
        return FloatToken;
    }(ReservedWordToken));
    Tokens.FloatToken = FloatToken;
    var IfToken = /** @class */ (function (_super) {
        __extends(IfToken, _super);
        function IfToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "if";
            return _this;
        }
        return IfToken;
    }(ReservedWordToken));
    Tokens.IfToken = IfToken;
    var InstanceofToken = /** @class */ (function (_super) {
        __extends(InstanceofToken, _super);
        function InstanceofToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "instanceof";
            return _this;
        }
        return InstanceofToken;
    }(ReservedWordToken));
    Tokens.InstanceofToken = InstanceofToken;
    var LongToken = /** @class */ (function (_super) {
        __extends(LongToken, _super);
        function LongToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "long";
            return _this;
        }
        return LongToken;
    }(ReservedWordToken));
    Tokens.LongToken = LongToken;
    var PackageToken = /** @class */ (function (_super) {
        __extends(PackageToken, _super);
        function PackageToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "package";
            return _this;
        }
        return PackageToken;
    }(ReservedWordToken));
    Tokens.PackageToken = PackageToken;
    var ReturnToken = /** @class */ (function (_super) {
        __extends(ReturnToken, _super);
        function ReturnToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "return";
            return _this;
        }
        return ReturnToken;
    }(ReservedWordToken));
    Tokens.ReturnToken = ReturnToken;
    var SwitchToken = /** @class */ (function (_super) {
        __extends(SwitchToken, _super);
        function SwitchToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "switch";
            return _this;
        }
        return SwitchToken;
    }(ReservedWordToken));
    Tokens.SwitchToken = SwitchToken;
    var ThrowsToken = /** @class */ (function (_super) {
        __extends(ThrowsToken, _super);
        function ThrowsToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "throws";
            return _this;
        }
        return ThrowsToken;
    }(ReservedWordToken));
    Tokens.ThrowsToken = ThrowsToken;
    var TypeofToken = /** @class */ (function (_super) {
        __extends(TypeofToken, _super);
        function TypeofToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "typeof";
            return _this;
        }
        return TypeofToken;
    }(ReservedWordToken));
    Tokens.TypeofToken = TypeofToken;
    var WhileToken = /** @class */ (function (_super) {
        __extends(WhileToken, _super);
        function WhileToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "while";
            return _this;
        }
        return WhileToken;
    }(ReservedWordToken));
    Tokens.WhileToken = WhileToken;
    var AwaitToken = /** @class */ (function (_super) {
        __extends(AwaitToken, _super);
        function AwaitToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "await";
            return _this;
        }
        return AwaitToken;
    }(ReservedWordToken));
    Tokens.AwaitToken = AwaitToken;
    var CaseToken = /** @class */ (function (_super) {
        __extends(CaseToken, _super);
        function CaseToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "case";
            return _this;
        }
        return CaseToken;
    }(ReservedWordToken));
    Tokens.CaseToken = CaseToken;
    var ConstToken = /** @class */ (function (_super) {
        __extends(ConstToken, _super);
        function ConstToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "const";
            return _this;
        }
        return ConstToken;
    }(ReservedWordToken));
    Tokens.ConstToken = ConstToken;
    var DeleteToken = /** @class */ (function (_super) {
        __extends(DeleteToken, _super);
        function DeleteToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "delete";
            return _this;
        }
        return DeleteToken;
    }(ReservedWordToken));
    Tokens.DeleteToken = DeleteToken;
    var EnumToken = /** @class */ (function (_super) {
        __extends(EnumToken, _super);
        function EnumToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "enum";
            return _this;
        }
        return EnumToken;
    }(ReservedWordToken));
    Tokens.EnumToken = EnumToken;
    var FalseToken = /** @class */ (function (_super) {
        __extends(FalseToken, _super);
        function FalseToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "false";
            return _this;
        }
        return FalseToken;
    }(ReservedWordToken));
    Tokens.FalseToken = FalseToken;
    var ForToken = /** @class */ (function (_super) {
        __extends(ForToken, _super);
        function ForToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "for";
            return _this;
        }
        return ForToken;
    }(ReservedWordToken));
    Tokens.ForToken = ForToken;
    var ImplementsToken = /** @class */ (function (_super) {
        __extends(ImplementsToken, _super);
        function ImplementsToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "implements";
            return _this;
        }
        return ImplementsToken;
    }(ReservedWordToken));
    Tokens.ImplementsToken = ImplementsToken;
    var IntToken = /** @class */ (function (_super) {
        __extends(IntToken, _super);
        function IntToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "int";
            return _this;
        }
        return IntToken;
    }(ReservedWordToken));
    Tokens.IntToken = IntToken;
    var NativeToken = /** @class */ (function (_super) {
        __extends(NativeToken, _super);
        function NativeToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "native";
            return _this;
        }
        return NativeToken;
    }(ReservedWordToken));
    Tokens.NativeToken = NativeToken;
    var PrivateToken = /** @class */ (function (_super) {
        __extends(PrivateToken, _super);
        function PrivateToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "private";
            return _this;
        }
        return PrivateToken;
    }(ReservedWordToken));
    Tokens.PrivateToken = PrivateToken;
    var ShortToken = /** @class */ (function (_super) {
        __extends(ShortToken, _super);
        function ShortToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "short";
            return _this;
        }
        return ShortToken;
    }(ReservedWordToken));
    Tokens.ShortToken = ShortToken;
    var SynchronizedToken = /** @class */ (function (_super) {
        __extends(SynchronizedToken, _super);
        function SynchronizedToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "synchronized";
            return _this;
        }
        return SynchronizedToken;
    }(ReservedWordToken));
    Tokens.SynchronizedToken = SynchronizedToken;
    var TransientToken = /** @class */ (function (_super) {
        __extends(TransientToken, _super);
        function TransientToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "transient";
            return _this;
        }
        return TransientToken;
    }(ReservedWordToken));
    Tokens.TransientToken = TransientToken;
    var VarToken = /** @class */ (function (_super) {
        __extends(VarToken, _super);
        function VarToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "var";
            return _this;
        }
        return VarToken;
    }(ReservedWordToken));
    Tokens.VarToken = VarToken;
    var WithToken = /** @class */ (function (_super) {
        __extends(WithToken, _super);
        function WithToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "with";
            return _this;
        }
        return WithToken;
    }(ReservedWordToken));
    Tokens.WithToken = WithToken;
    var BooleanToken = /** @class */ (function (_super) {
        __extends(BooleanToken, _super);
        function BooleanToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "boolean";
            return _this;
        }
        return BooleanToken;
    }(ReservedWordToken));
    Tokens.BooleanToken = BooleanToken;
    var CatchToken = /** @class */ (function (_super) {
        __extends(CatchToken, _super);
        function CatchToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "catch";
            return _this;
        }
        return CatchToken;
    }(ReservedWordToken));
    Tokens.CatchToken = CatchToken;
    var ContinueToken = /** @class */ (function (_super) {
        __extends(ContinueToken, _super);
        function ContinueToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "continue";
            return _this;
        }
        return ContinueToken;
    }(ReservedWordToken));
    Tokens.ContinueToken = ContinueToken;
    var DoToken = /** @class */ (function (_super) {
        __extends(DoToken, _super);
        function DoToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "do";
            return _this;
        }
        return DoToken;
    }(ReservedWordToken));
    Tokens.DoToken = DoToken;
    var EvalToken = /** @class */ (function (_super) {
        __extends(EvalToken, _super);
        function EvalToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "eval";
            return _this;
        }
        return EvalToken;
    }(ReservedWordToken));
    Tokens.EvalToken = EvalToken;
    var FinalToken = /** @class */ (function (_super) {
        __extends(FinalToken, _super);
        function FinalToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "final";
            return _this;
        }
        return FinalToken;
    }(ReservedWordToken));
    Tokens.FinalToken = FinalToken;
    var FunctionToken = /** @class */ (function (_super) {
        __extends(FunctionToken, _super);
        function FunctionToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "function";
            return _this;
        }
        return FunctionToken;
    }(ReservedWordToken));
    Tokens.FunctionToken = FunctionToken;
    var ImportToken = /** @class */ (function (_super) {
        __extends(ImportToken, _super);
        function ImportToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "import";
            return _this;
        }
        return ImportToken;
    }(ReservedWordToken));
    Tokens.ImportToken = ImportToken;
    var InterfaceToken = /** @class */ (function (_super) {
        __extends(InterfaceToken, _super);
        function InterfaceToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "interface";
            return _this;
        }
        return InterfaceToken;
    }(ReservedWordToken));
    Tokens.InterfaceToken = InterfaceToken;
    var NewToken = /** @class */ (function (_super) {
        __extends(NewToken, _super);
        function NewToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "new";
            return _this;
        }
        return NewToken;
    }(ReservedWordToken));
    Tokens.NewToken = NewToken;
    var ProtectedToken = /** @class */ (function (_super) {
        __extends(ProtectedToken, _super);
        function ProtectedToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "protected";
            return _this;
        }
        return ProtectedToken;
    }(ReservedWordToken));
    Tokens.ProtectedToken = ProtectedToken;
    var StaticToken = /** @class */ (function (_super) {
        __extends(StaticToken, _super);
        function StaticToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "static";
            return _this;
        }
        return StaticToken;
    }(ReservedWordToken));
    Tokens.StaticToken = StaticToken;
    var ThisToken = /** @class */ (function (_super) {
        __extends(ThisToken, _super);
        function ThisToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "this";
            return _this;
        }
        return ThisToken;
    }(ReservedWordToken));
    Tokens.ThisToken = ThisToken;
    var TrueToken = /** @class */ (function (_super) {
        __extends(TrueToken, _super);
        function TrueToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "true";
            return _this;
        }
        return TrueToken;
    }(ReservedWordToken));
    Tokens.TrueToken = TrueToken;
    var VoidToken = /** @class */ (function (_super) {
        __extends(VoidToken, _super);
        function VoidToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "void";
            return _this;
        }
        return VoidToken;
    }(ReservedWordToken));
    Tokens.VoidToken = VoidToken;
    var YieldToken = /** @class */ (function (_super) {
        __extends(YieldToken, _super);
        function YieldToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "yield";
            return _this;
        }
        return YieldToken;
    }(ReservedWordToken));
    Tokens.YieldToken = YieldToken;
    var EqualsToken = /** @class */ (function (_super) {
        __extends(EqualsToken, _super);
        function EqualsToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "=";
            return _this;
        }
        return EqualsToken;
    }(FixedTextToken));
    Tokens.EqualsToken = EqualsToken;
    var PlusToken = /** @class */ (function (_super) {
        __extends(PlusToken, _super);
        function PlusToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "+";
            return _this;
        }
        return PlusToken;
    }(FixedTextToken));
    Tokens.PlusToken = PlusToken;
    var DashToken = /** @class */ (function (_super) {
        __extends(DashToken, _super);
        function DashToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "-";
            return _this;
        }
        return DashToken;
    }(FixedTextToken));
    Tokens.DashToken = DashToken;
    var AsteriskToken = /** @class */ (function (_super) {
        __extends(AsteriskToken, _super);
        function AsteriskToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "*";
            return _this;
        }
        return AsteriskToken;
    }(FixedTextToken));
    Tokens.AsteriskToken = AsteriskToken;
    var SlashToken = /** @class */ (function (_super) {
        __extends(SlashToken, _super);
        function SlashToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "/";
            return _this;
        }
        return SlashToken;
    }(FixedTextToken));
    Tokens.SlashToken = SlashToken;
    var BackslashToken = /** @class */ (function (_super) {
        __extends(BackslashToken, _super);
        function BackslashToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = "\\";
            return _this;
        }
        return BackslashToken;
    }(FixedTextToken));
    Tokens.BackslashToken = BackslashToken;
    var DotToken = /** @class */ (function (_super) {
        __extends(DotToken, _super);
        function DotToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = ".";
            return _this;
        }
        return DotToken;
    }(FixedTextToken));
    Tokens.DotToken = DotToken;
    var CommaToken = /** @class */ (function (_super) {
        __extends(CommaToken, _super);
        function CommaToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = ",";
            return _this;
        }
        return CommaToken;
    }(FixedTextToken));
    Tokens.CommaToken = CommaToken;
    var ColonToken = /** @class */ (function (_super) {
        __extends(ColonToken, _super);
        function ColonToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = ":";
            return _this;
        }
        return ColonToken;
    }(FixedTextToken));
    Tokens.ColonToken = ColonToken;
    var SemicolonToken = /** @class */ (function (_super) {
        __extends(SemicolonToken, _super);
        function SemicolonToken() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.text = ";";
            return _this;
        }
        return SemicolonToken;
    }(FixedTextToken));
    Tokens.SemicolonToken = SemicolonToken;
})(Tokens = exports.Tokens || (exports.Tokens = {}));
