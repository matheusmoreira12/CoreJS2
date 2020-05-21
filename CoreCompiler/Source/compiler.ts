import ts = require("typescript");

let exportStatementCount = 0;

const MODULE_CONTEXT_NAME = "__mod_context";

function getModuleConstructor(moduleName: string, moduleBody: ts.ModuleBody) {
    function getBody() {
        return ts.createBlock(
            [],
            true
        );
    }

    return ts.createFunctionDeclaration(
        [],
        ts.createModifiersFromModifierFlags(ts.ModifierFlags.Async),
        undefined,
        moduleName,
        [],
        [
            ts.createParameter(
                [],
                [],
                undefined,
                MODULE_CONTEXT_NAME
            )
        ],
        undefined,
        getBody()
    );
}

function transformModuleDeclaration(node: ts.ModuleDeclaration): ts.Node | undefined {
    const moduleName = node.name.text;
    const moduleBody = node.body;
    return getModuleConstructor(moduleName, moduleBody);
}

class NestedIdentifierHelper implements ts.EmitHelper {
    constructor(names: string[]) {
        this._names = names;
    }

    name: string = "NestedIdentifier";
    scoped: boolean = true;
    priority: number = 0;

    text(): string {
        return this._names.join("::");
    }

    private _names: string[];
}

function nestedIdentifierTransformer(/*opts?: Opts*/) {
    function visitor(context: ts.TransformationContext, sourceFile: ts.SourceFile) {
        function visitor(node: ts.Node): ts.VisitResult<ts.Node> {
            // here we can check each node and potentially return 
            // new nodes if we want to leave the node as is, and 
            // continue searching through child nodes:
            console.log(ts.SyntaxKind[node.kind]);

            if (ts.isLabeledStatement(node))
                return ts.createNotEmittedStatement(node);

            return ts.visitEachChild(node, visitor, context)
        }
        return visitor
    }

    return (context: ts.TransformationContext): ts.Transformer<ts.Node> => {
        return (sourceFile: ts.SourceFile) => ts.visitNode(sourceFile, visitor(context, sourceFile));
    }
}

let input = `
let x: int;
let y, z: int;

public namespace Test::Test::Namespace {
    public class X {
    }
}

using Test::Namespace;

function f() {
    
}
`;

let source = ts.createSourceFile("test.d.ts", input, ts.ScriptTarget.ES2015);

let transformResult = ts.transform(
    source,
    [nestedIdentifierTransformer()]
);

console.log(transformResult.transformed[0]);