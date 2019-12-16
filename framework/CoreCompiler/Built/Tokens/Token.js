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
    function TokenModel() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.text = null;
        this.children = [];
        if (args.length == 1) {
            if (typeof args[0] == "string")
                this.text = args[0];
            else
                throw "Invalid value for argument \"text\". A value of type String was expected.";
        }
        else if (args.length == 2) {
            if (typeof args[0] == "function")
                this.emit = args[0];
            else
                throw "Invalid value for argument \"emit\". A value of type Function was expected.";
            if (typeof args[1] == "function")
                this.take = args[1];
            else
                throw "Invalid value for argument \"take\". A value of type Function was expected.";
        }
        else
            throw "The number of specified parameters is invalid.";
    }
    TokenModel.prototype.emit = function (source) {
    };
    TokenModel.prototype.take = function (token) {
    };
    return TokenModel;
}());
exports.TokenModel = TokenModel;
