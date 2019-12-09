"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
var ts = require("typescript");
var declarationContext = {
    declarations: [
        []
    ],
    push: function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        return this.declarations.push(names);
    },
    pop: function () {
        return this.declarations.pop();
    },
    getCurrent: function () {
        return this.declarations[this.declarations.length - 1];
    },
    hasName: function (name) {
        return this.declarations.some(function (c) { return c.includes(name); });
    }
};
function getDeclarations(node) {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(ts.isVariableDeclaration(node) ||
                    ts.isEnumDeclaration(node) ||
                    ts.isClassDeclaration(node) ||
                    ts.isFunctionDeclaration(node))) return [3 /*break*/, 2];
                return [4 /*yield*/, node.name];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}
function transformDoubleColon(node) {
    if (node.kind == ts.SyntaxKind.SemicolonToken) {
        console.log("colon!");
    }
}
function simpleTransformer() {
    return function (context) {
        var visit = function (node) {
            transformDoubleColon(node);
            declarationContext.push.apply(declarationContext, __spread(getDeclarations(node)));
            var result = ts.visitEachChild(node, function (child) { return visit(child); }, context);
            declarationContext.pop();
            return result;
        };
        return function (node) { return ts.visitNode(node, visit); };
    };
}
var input = "\n    let x: int;\n\n    export class X::Y {\n    }\n\n    function f() {\n        \n    }\n";
var result = ts.transpileModule(input, {
    compilerOptions: {
        module: ts.ModuleKind.ESNext
    },
    transformers: {
        before: [simpleTransformer()]
    }
});
console.log(result);
