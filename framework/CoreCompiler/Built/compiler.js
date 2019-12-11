"use strict";
exports.__esModule = true;
var ts = require("typescript");
var exportStatementCount = 0;
function transformModuleDeclaration(node) {
    var moduleName = node.name.text;
    return ts.createArrowFunction([ts.createModifier(ts.SyntaxKind.AsyncKeyword)], undefined, [
        ts.createParameter([], [], undefined, "__module_context")
    ], undefined, ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), ts.createBlock([]));
}
function moduleSystemTransformer() {
    return function (context) {
        var visit = function (node) {
            if (ts.isModuleDeclaration(node))
                return transformModuleDeclaration(node);
            return ts.visitEachChild(node, visit, context);
        };
        return function (node) { return ts.visitNode(node, visit); };
    };
}
var input = "\nlet x: int;\nlet y, z: int;\n\nexport namespace Test__Namespace {\n    export class X {\n    }\n}\n\nimport Test__Namespace;\n\nfunction f() {\n    \n}\n";
console.log(input);
var result = ts.transpileModule(input, {
    compilerOptions: {
        module: ts.ModuleKind.None
    },
    transformers: {
        before: [moduleSystemTransformer()]
    }
});
console.log(result.outputText);
