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
})(Tokens = exports.Tokens || (exports.Tokens = {}));
