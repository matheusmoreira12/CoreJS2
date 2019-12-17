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
var TokenModelType;
(function (TokenModelType) {
    TokenModelType[TokenModelType["Text"] = 0] = "Text";
    TokenModelType[TokenModelType["Structured"] = 1] = "Structured";
    TokenModelType[TokenModelType["Custom"] = 2] = "Custom";
})(TokenModelType = exports.TokenModelType || (exports.TokenModelType = {}));
var TokenModel = /** @class */ (function () {
    function TokenModel() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.emit = null;
        this.take = null;
        this.text = null;
        this.children = [];
        if (args.length == 1) {
            if (typeof args[0] == "string") {
                this.text = args[0];
                this.type = TokenModelType.Text;
            }
            else if (args[0] instanceof Array) {
                this.children = args[0];
                this.type = TokenModelType.Structured;
            }
            else
                throw "Invalid value for argument args[0]. A value of type String or Array was expected.";
        }
        else if (args.length == 2) {
            if (typeof args[0] == "function")
                this.emit = args[0];
            else
                throw "Invalid value for argument args[0]. A value of type Function was expected.";
            if (typeof args[1] == "function")
                this.take = args[1];
            else
                throw "Invalid value for argument args[1]. A value of type Function was expected.";
            this.type = TokenModelType.Custom;
        }
        else
            throw "The number of specified parameters is invalid.";
    }
    return TokenModel;
}());
exports.TokenModel = TokenModel;
