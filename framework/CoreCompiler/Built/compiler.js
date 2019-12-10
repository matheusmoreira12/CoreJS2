"use strict";
exports.__esModule = true;
var ts = require("typescript");
function simpleTransformer() {
    return function (context) {
        var visitToken = function (token) {
            console.log(ts.SyntaxKind[token.kind]);
            var siblings = token.parent.getChildren();
            var lastToken = siblings[token.pos - 1];
            if (lastToken.kind == ts.SyntaxKind.ColonToken) {
                if (token.kind == ts.SyntaxKind.ColonToken)
                    return undefined;
            }
            return token;
        };
        var visit = function (node) {
            return ts.visitEachChild(node, function (child) { return visit(child); }, context, undefined, function (token) { return visitToken(token); });
        };
        return function (node) { return ts.visitNode(node, visit); };
    };
}
var input = "\n    let x: int;\n    let y, z: int;\n\n    export namespace ___Test__Namespace {\n        export class X {\n        }\n    }\n\n    function f() {\n        \n    }\n";
var result = ts.transpileModule(input, {
    compilerOptions: {
        module: ts.ModuleKind.ESNext
    },
    transformers: {
        afterDeclarations: [simpleTransformer()]
    }
});
console.log(result);
