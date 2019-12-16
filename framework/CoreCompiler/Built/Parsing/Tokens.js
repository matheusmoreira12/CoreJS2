"use strict";
exports.__esModule = true;
var Token_1 = require("../Tokens/Token");
var Tokens;
(function (Tokens) {
    //Tokens
    //  Fixed
    Tokens.abstractToken = new Token_1.TokenModel("abstract");
    Tokens.breakToken = new Token_1.TokenModel("break");
    Tokens.charToken = new Token_1.TokenModel("char");
    Tokens.debuggerToken = new Token_1.TokenModel("debugger");
    Tokens.doubleToken = new Token_1.TokenModel("double");
    Tokens.exportToken = new Token_1.TokenModel("export");
    Tokens.finallyToken = new Token_1.TokenModel("finally");
    Tokens.gotoToken = new Token_1.TokenModel("goto");
    Tokens.inToken = new Token_1.TokenModel("in");
    Tokens.letToken = new Token_1.TokenModel("let");
    Tokens.nullToken = new Token_1.TokenModel("null");
    Tokens.publicToken = new Token_1.TokenModel("public");
    Tokens.superToken = new Token_1.TokenModel("super");
    Tokens.throwToken = new Token_1.TokenModel("throw");
    Tokens.tryToken = new Token_1.TokenModel("try");
    Tokens.volatileToken = new Token_1.TokenModel("volatile");
    Tokens.argumentsToken = new Token_1.TokenModel("arguments");
    Tokens.byteToken = new Token_1.TokenModel("byte");
    Tokens.classToken = new Token_1.TokenModel("class");
    Tokens.defaultToken = new Token_1.TokenModel("default");
    Tokens.elseToken = new Token_1.TokenModel("else");
    Tokens.extendsToken = new Token_1.TokenModel("extends");
    Tokens.floatToken = new Token_1.TokenModel("float");
    Tokens.ifToken = new Token_1.TokenModel("if");
    Tokens.instanceofToken = new Token_1.TokenModel("instanceof");
    Tokens.longToken = new Token_1.TokenModel("long");
    Tokens.packageToken = new Token_1.TokenModel("package");
    Tokens.returnToken = new Token_1.TokenModel("return");
    Tokens.switchToken = new Token_1.TokenModel("switch");
    Tokens.throwsToken = new Token_1.TokenModel("throws");
    Tokens.typeofToken = new Token_1.TokenModel("typeof");
    Tokens.whileToken = new Token_1.TokenModel("while");
    Tokens.awaitToken = new Token_1.TokenModel("await");
    Tokens.caseToken = new Token_1.TokenModel("case");
    Tokens.constToken = new Token_1.TokenModel("const");
    Tokens.deleteToken = new Token_1.TokenModel("delete");
    Tokens.enumToken = new Token_1.TokenModel("enum");
    Tokens.falseToken = new Token_1.TokenModel("false");
    Tokens.forToken = new Token_1.TokenModel("for");
    Tokens.implementsToken = new Token_1.TokenModel("extends");
    Tokens.intToken = new Token_1.TokenModel("int");
    Tokens.nativeToken = new Token_1.TokenModel("native");
    Tokens.privateToken = new Token_1.TokenModel("private");
    Tokens.shortToken = new Token_1.TokenModel("short");
    Tokens.synchronizedToken = new Token_1.TokenModel("synchronized");
    Tokens.transientToken = new Token_1.TokenModel("transient");
    Tokens.varToken = new Token_1.TokenModel("var");
    Tokens.withToken = new Token_1.TokenModel("with");
    Tokens.booleanToken = new Token_1.TokenModel("boolean");
    Tokens.catchToken = new Token_1.TokenModel("catch");
    Tokens.continueToken = new Token_1.TokenModel("continue");
    Tokens.doToken = new Token_1.TokenModel("do");
    Tokens.evalToken = new Token_1.TokenModel("eval");
    Tokens.finalToken = new Token_1.TokenModel("final");
    Tokens.functionToken = new Token_1.TokenModel("function");
    Tokens.importToken = new Token_1.TokenModel("import");
    Tokens.interfaceToken = new Token_1.TokenModel("interface");
    Tokens.newToken = new Token_1.TokenModel("new");
    Tokens.protectedToken = new Token_1.TokenModel("protected");
    Tokens.staticToken = new Token_1.TokenModel("static");
    Tokens.thisToken = new Token_1.TokenModel("this");
    Tokens.trueToken = new Token_1.TokenModel("true");
    Tokens.voidToken = new Token_1.TokenModel("void");
    Tokens.yieldToken = new Token_1.TokenModel("yield");
    Tokens.equalsToken = new Token_1.TokenModel("=");
    Tokens.plusToken = new Token_1.TokenModel("+");
    Tokens.dashToken = new Token_1.TokenModel("-");
    Tokens.asteriskToken = new Token_1.TokenModel("*");
    Tokens.greaterThanToken = new Token_1.TokenModel(">");
    Tokens.lesserThanToken = new Token_1.TokenModel("<");
    Tokens.slashToken = new Token_1.TokenModel("/");
    Tokens.percentToken = new Token_1.TokenModel("%");
    Tokens.backslashToken = new Token_1.TokenModel("\\");
    Tokens.commaToken = new Token_1.TokenModel(",");
    Tokens.semicolonToken = new Token_1.TokenModel(";");
    Tokens.colonToken = new Token_1.TokenModel(":");
    Tokens.dotToken = new Token_1.TokenModel(".");
    Tokens.ampersandToken = new Token_1.TokenModel("&");
    Tokens.questionToken = new Token_1.TokenModel("?");
    Tokens.exclamationToken = new Token_1.TokenModel("!");
    Tokens.openParenToken = new Token_1.TokenModel("(");
    Tokens.closeParenToken = new Token_1.TokenModel(")");
    Tokens.openBracketToken = new Token_1.TokenModel("[");
    Tokens.closeBracketToken = new Token_1.TokenModel("]");
    Tokens.openBraceToken = new Token_1.TokenModel("{");
    Tokens.closeBraceToken = new Token_1.TokenModel("}");
    Tokens.singleQuoteToken = new Token_1.TokenModel("'");
    Tokens.doubleQuoteToken = new Token_1.TokenModel("\"");
    Tokens.atToken = new Token_1.TokenModel("@");
    Tokens.barToken = new Token_1.TokenModel("|");
    Tokens.graveToken = new Token_1.TokenModel("`");
    Tokens.dollarToken = new Token_1.TokenModel("$");
    Tokens.tildeToken = new Token_1.TokenModel("~");
    Tokens.caretToken = new Token_1.TokenModel("^");
    //String
    Tokens.singleQuoteStringToken = new Token_1.TokenModel([Tokens.singleQuoteToken, null, Tokens.singleQuoteToken]);
    Tokens.doubleQuoteStringToken = new Token_1.TokenModel([Tokens.doubleQuoteToken, null, Tokens.doubleQuoteToken]);
    //Operators
    //  Arithmetic
    Tokens.additionOperatorToken = Tokens.plusToken;
    Tokens.subtractionOperatorToken = Tokens.dashToken;
    Tokens.multiplicationOperatorToken = Tokens.asteriskToken;
    Tokens.divisionOperatorToken = Tokens.slashToken;
    Tokens.modulusOperatorToken = Tokens.percentToken;
    Tokens.exponentiationOperatorToken = new Token_1.TokenModel([Tokens.asteriskToken, Tokens.asteriskToken]);
    Tokens.incrementOperatorToken = new Token_1.TokenModel([Tokens.plusToken, Tokens.plusToken]);
    Tokens.decrementOperatorToken = new Token_1.TokenModel([Tokens.dashToken, Tokens.dashToken]);
    //  Relational
    Tokens.greaterThanOperatorToken = Tokens.greaterThanToken;
    Tokens.lesserThanOperatorToken = Tokens.lesserThanToken;
    Tokens.greaterThanOrEqualsOperatorToken = new Token_1.TokenModel([Tokens.lesserThanToken, Tokens.equalsToken]);
    Tokens.lesserThanOrEqualsOperatorToken = new Token_1.TokenModel([Tokens.greaterThanToken, Tokens.equalsToken]);
    Tokens.equalsOperatorToken = new Token_1.TokenModel([Tokens.equalsToken, Tokens.equalsToken]);
    Tokens.notEqualsOperatorToken = new Token_1.TokenModel([Tokens.exclamationToken, Tokens.equalsToken]);
    //  Logical
    Tokens.andOperatorToken = new Token_1.TokenModel([Tokens.ampersandToken, Tokens.ampersandToken]);
    Tokens.orOperatorToken = new Token_1.TokenModel([Tokens.barToken, Tokens.barToken]);
    Tokens.notOperatorToken = Tokens.exclamationToken;
    //  Bitwise
    Tokens.bitwiseAndOperatorToken = Tokens.ampersandToken;
    Tokens.bitwiseOrOperatorToken = Tokens.barToken;
    Tokens.bitwiseXorOperatorToken = Tokens.caretToken;
    Tokens.bitwiseNotOperatorToken = Tokens.tildeToken;
    Tokens.leftShiftOperatorToken = new Token_1.TokenModel([Tokens.lesserThanToken, Tokens.lesserThanToken]);
    Tokens.signPropagatingRightShiftOperatorToken = new Token_1.TokenModel([Tokens.greaterThanToken, Tokens.greaterThanToken]);
    Tokens.zeroFillRightShiftOperatorToken = new Token_1.TokenModel([Tokens.greaterThanToken, Tokens.greaterThanToken, Tokens.greaterThanToken]);
    //  Assignment
    Tokens.simpleAssignOperatorToken = Tokens.equalsToken;
    Tokens.addAssignOperatorToken = new Token_1.TokenModel([Tokens.plusToken, Tokens.equalsToken]);
    Tokens.subtractAssignOperatorToken = new Token_1.TokenModel([Tokens.dashToken, Tokens.equalsToken]);
    Tokens.multiplyAssignOperatorToken = new Token_1.TokenModel([Tokens.asteriskToken, Tokens.equalsToken]);
    Tokens.divideAssignOperatorToken = new Token_1.TokenModel([Tokens.slashToken, Tokens.equalsToken]);
    //  Miscellaneous
    Tokens.negationOperatorToken = Tokens.dashToken;
    //  String
    Tokens.concatenationOperatorToken = Tokens.plusToken;
    //  Conditional
    Tokens.conditionalOperatorToken = Tokens.questionToken;
    //  Type
    Tokens.typeofOperator = Tokens.typeofToken;
})(Tokens = exports.Tokens || (exports.Tokens = {}));
