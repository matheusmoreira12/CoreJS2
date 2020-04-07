"use strict";
exports.__esModule = true;
var ts = require("typescript");
var exportStatementCount = 0;
var MODULE_CONTEXT_NAME = "__mod_context";
function getModuleConstructor(moduleName, moduleBody) {
    function getBody() {
        return ts.createBlock([], true);
    }
    return ts.createFunctionDeclaration([], ts.createModifiersFromModifierFlags(ts.ModifierFlags.Async), undefined, moduleName, [], [
        ts.createParameter([], [], undefined, MODULE_CONTEXT_NAME)
    ], undefined, getBody());
}
function transformModuleDeclaration(node) {
    var moduleName = node.name.text;
    var moduleBody = node.body;
    return getModuleConstructor(moduleName, moduleBody);
}
var NestedIdentifierHelper = /** @class */ (function () {
    function NestedIdentifierHelper(names) {
        this.name = "NestedIdentifier";
        this.scoped = true;
        this.priority = 0;
        this._names = names;
    }
    NestedIdentifierHelper.prototype.text = function () {
        return this._names.join("::");
    };
    return NestedIdentifierHelper;
}());
function nestedIdentifierTransformer( /*opts?: Opts*/) {
    function visitor(context, sourceFile) {
        function visitor(node) {
            // here we can check each node and potentially return 
            // new nodes if we want to leave the node as is, and 
            // continue searching through child nodes:
            console.log(ts.SyntaxKind[node.kind]);
            if (ts.isLabeledStatement(node))
                return ts.createNotEmittedStatement(node);
            return ts.visitEachChild(node, visitor, context);
        }
        return visitor;
    }
    return function (context) {
        return function (sourceFile) { return ts.visitNode(sourceFile, visitor(context, sourceFile)); };
    };
}
var input = "\nlet x: int;\nlet y, z: int;\n\npublic namespace Test::Test::Namespace {\n    public class X {\n    }\n}\n\nusing Test::Namespace;\n\nfunction f() {\n    \n}\n";
var source = ts.createSourceFile("test.d.ts", input, ts.ScriptTarget.ES2015);
var transformResult = ts.transform(source, [nestedIdentifierTransformer()]);
console.log(transformResult.transformed[0]);
