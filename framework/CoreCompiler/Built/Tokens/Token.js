"use strict";
exports.__esModule = true;
var Token = /** @class */ (function () {
    function Token(model, source, start, end, parent, children) {
        this.model = model;
        this.source = source;
        this.start = start;
        this.end = end;
        this.parent = parent === undefined ? null : parent;
        this.children = children === undefined ? null : [];
    }
    Token.prototype.getText = function () {
        return this.source.inputText.slice(this.start, this.end);
    };
    return Token;
}());
exports["default"] = Token;
var TokenModel = /** @class */ (function () {
    function TokenModel(arg) {
        this.text = null;
        this.children = [];
        if (typeof arg === "string")
            this.text = arg;
        else if (arg instanceof Array)
            this.children = arg;
        else
            throw "The specified parameter value is invalid.";
    }
    TokenModel.prototype.emit = function (source) {
    };
    TokenModel.prototype.take = function (token) {
    };
    return TokenModel;
}());
exports.TokenModel = TokenModel;
