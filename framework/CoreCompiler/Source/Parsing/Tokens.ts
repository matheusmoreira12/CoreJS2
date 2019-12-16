import Token, { TokenModel } from "../Tokens/Token";
import Tokenizer from "../Tokens/Tokenizer";

export namespace Tokens {
    //Tokens
    //  Fixed
    export const abstractToken = new TokenModel("abstract");
    export const breakToken = new TokenModel("break");
    export const charToken = new TokenModel("char");
    export const debuggerToken = new TokenModel("debugger");
    export const doubleToken = new TokenModel("double");
    export const exportToken = new TokenModel("export");
    export const finallyToken = new TokenModel("finally");
    export const gotoToken = new TokenModel("goto");
    export const inToken = new TokenModel("in");
    export const letToken = new TokenModel("let");
    export const nullToken = new TokenModel("null");
    export const publicToken = new TokenModel("public");
    export const superToken = new TokenModel("super");
    export const throwToken = new TokenModel("throw");
    export const tryToken = new TokenModel("try")
    export const volatileToken = new TokenModel("volatile");
    export const argumentsToken = new TokenModel("arguments");
    export const byteToken = new TokenModel("byte");
    export const classToken = new TokenModel("class");
    export const defaultToken = new TokenModel("default");
    export const elseToken = new TokenModel("else");
    export const extendsToken = new TokenModel("extends");
    export const floatToken = new TokenModel("float");
    export const ifToken = new TokenModel("if");
    export const instanceofToken = new TokenModel("instanceof");
    export const longToken = new TokenModel("long");
    export const packageToken = new TokenModel("package");
    export const returnToken = new TokenModel("return");
    export const switchToken = new TokenModel("switch");
    export const throwsToken = new TokenModel("throws");
    export const typeofToken = new TokenModel("typeof");
    export const whileToken = new TokenModel("while");
    export const awaitToken = new TokenModel("await");
    export const caseToken = new TokenModel("case");
    export const constToken = new TokenModel("const");
    export const deleteToken = new TokenModel("delete");
    export const enumToken = new TokenModel("enum");
    export const falseToken = new TokenModel("false");
    export const forToken = new TokenModel("for");
    export const implementsToken = new TokenModel("extends");
    export const intToken = new TokenModel("int");
    export const nativeToken = new TokenModel("native")
    export const privateToken = new TokenModel("private")
    export const shortToken = new TokenModel("short");
    export const synchronizedToken = new TokenModel("synchronized");
    export const transientToken = new TokenModel("transient");
    export const varToken = new TokenModel("var");
    export const withToken = new TokenModel("with");
    export const booleanToken = new TokenModel("boolean");
    export const catchToken = new TokenModel("catch");
    export const continueToken = new TokenModel("continue");
    export const doToken = new TokenModel("do");
    export const evalToken = new TokenModel("eval");
    export const finalToken = new TokenModel("final");
    export const functionToken = new TokenModel("function");
    export const importToken = new TokenModel("import");
    export const interfaceToken = new TokenModel("interface");
    export const newToken = new TokenModel("new");
    export const protectedToken = new TokenModel("protected");
    export const staticToken = new TokenModel("static");
    export const thisToken = new TokenModel("this");
    export const trueToken = new TokenModel("true");
    export const voidToken = new TokenModel("void");
    export const yieldToken = new TokenModel("yield");
    export const equalsToken = new TokenModel("=");
    export const plusToken = new TokenModel("+");
    export const dashToken = new TokenModel("-");
    export const asteriskToken = new TokenModel("*");
    export const greaterThanToken = new TokenModel(">");
    export const lesserThanToken = new TokenModel("<");
    export const slashToken = new TokenModel("/");
    export const percentToken = new TokenModel("%");
    export const backslashToken = new TokenModel("\\");
    export const commaToken = new TokenModel(",");
    export const semicolonToken = new TokenModel(";");
    export const colonToken = new TokenModel(":");
    export const dotToken = new TokenModel(".");
    export const ampersandToken = new TokenModel("&");
    export const questionToken = new TokenModel("?");
    export const exclamationToken = new TokenModel("!");
    export const openParenToken = new TokenModel("(");
    export const closeParenToken = new TokenModel(")");
    export const openBracketToken = new TokenModel("[");
    export const closeBracketToken = new TokenModel("]");
    export const openBraceToken = new TokenModel("{");
    export const closeBraceToken = new TokenModel("}");
    export const singleQuoteToken = new TokenModel("'");
    export const doubleQuoteToken = new TokenModel("\"");
    export const atToken = new TokenModel("@");
    export const barToken = new TokenModel("|");
    export const graveToken = new TokenModel("`");
    export const dollarToken = new TokenModel("$");
    export const tildeToken = new TokenModel("~");
    export const caretToken = new TokenModel("^");
    //String
    export const singleQuoteStringToken = new TokenModel([singleQuoteToken, null, singleQuoteToken]);
    export const doubleQuoteStringToken = new TokenModel([doubleQuoteToken, null, doubleQuoteToken]);
    //Operators
    //  Arithmetic
    export const additionOperatorToken = plusToken;
    export const subtractionOperatorToken = dashToken;
    export const multiplicationOperatorToken = asteriskToken;
    export const divisionOperatorToken = slashToken;
    export const modulusOperatorToken = percentToken;
    export const exponentiationOperatorToken = new TokenModel([asteriskToken, asteriskToken]);
    export const incrementOperatorToken = new TokenModel([plusToken, plusToken]);
    export const decrementOperatorToken = new TokenModel([dashToken, dashToken]);
    //  Relational
    export const greaterThanOperatorToken = greaterThanToken;
    export const lesserThanOperatorToken = lesserThanToken;
    export const greaterThanOrEqualsOperatorToken = new TokenModel([lesserThanToken, equalsToken]);
    export const lesserThanOrEqualsOperatorToken = new TokenModel([greaterThanToken, equalsToken]);
    export const equalsOperatorToken = new TokenModel([equalsToken, equalsToken]);
    export const notEqualsOperatorToken = new TokenModel([exclamationToken, equalsToken]);
    //  Logical
    export const andOperatorToken = new TokenModel([ampersandToken, ampersandToken]);
    export const orOperatorToken = new TokenModel([barToken, barToken]);
    export const notOperatorToken = exclamationToken;
    //  Bitwise
    export const bitwiseAndOperatorToken = ampersandToken;
    export const bitwiseOrOperatorToken = barToken;
    export const bitwiseXorOperatorToken = caretToken;
    export const bitwiseNotOperatorToken = tildeToken;
    export const leftShiftOperatorToken = new TokenModel([lesserThanToken, lesserThanToken]);
    export const signPropagatingRightShiftOperatorToken = new TokenModel([greaterThanToken, greaterThanToken]);
    export const zeroFillRightShiftOperatorToken = new TokenModel([greaterThanToken, greaterThanToken, greaterThanToken]);
    //  Assignment
    export const simpleAssignOperatorToken = equalsToken;
    export const addAssignOperatorToken = new TokenModel([plusToken, equalsToken]);
    export const subtractAssignOperatorToken = new TokenModel([dashToken, equalsToken]);
    export const multiplyAssignOperatorToken = new TokenModel([asteriskToken, equalsToken]);
    export const divideAssignOperatorToken = new TokenModel([slashToken, equalsToken]);
    //  Miscellaneous
    export const negationOperatorToken = dashToken;
    //  String
    export const concatenationOperatorToken = plusToken;
    //  Conditional
    export const conditionalOperatorToken = questionToken;
    //  Type
    export const typeofOperator = typeofToken;
}