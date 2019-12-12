"use strict";
exports.__esModule = true;
var ts = require("typescript");
var exportStatementCount = 0;
var MODULE_CONTEXT_NAME = "__mod_context";
function getModuleConstructor(moduleName, moduleBody) {
    function getBody() {
        return ts.createBlock([], true);
    }
    return ts.createAwait(ts.createArrowFunction(ts.createModifiersFromModifierFlags(ts.ModifierFlags.Async), [], [
        ts.createParameter([], [], undefined, MODULE_CONTEXT_NAME)
    ], undefined, undefined, getBody()));
}
function transformModuleDeclaration(node) {
    var moduleName = node.name.text;
    var moduleBody = node.body;
    return getModuleConstructor(moduleName, moduleBody);
}
function moduleSystemTransformer() {
    return function (context) {
        function visit(node) {
            console.log(ts.SyntaxKind[node.kind]);
            if (ts.isLabeledStatement(node))
                console.log(node.label);
            return ts.visitEachChild(node, visit, context);
        }
        ;
        return function (node) { return ts.visitNode(node, visit); };
    };
}
var input = "\nlet x: int;\nlet y, z: int;\n\npublic namespace Test::Test::Namespace {\n    public class X {\n    }\n}\n\nusing Test::Namespace;\n\nfunction f() {\n    \n}\n";
var source = ts.createSourceFile("test.d.ts", input, ts.ScriptTarget.ES2015);
var transformResult = ts.transform(source, [moduleSystemTransformer()], {
    composite: true
});
