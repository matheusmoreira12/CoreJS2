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

    return ts.createAwait(
        ts.createArrowFunction(
            ts.createModifiersFromModifierFlags(ts.ModifierFlags.Async),
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
            undefined,
            getBody()
        ));
}

function transformModuleDeclaration(node: ts.ModuleDeclaration): ts.Node | undefined {
    const moduleName = node.name.text;
    const moduleBody = node.body;
    return getModuleConstructor(moduleName, moduleBody);
}

class NestedIdentifierHelper implements ts.EmitHelper {
    constructor(namespace: string[]) {
        this.namespace = namespace;
    }

    get name(): string { return "NestedIdentifier" }
    get scoped(): boolean { return true; }
    get priority(): number { return 0; };
    get text(): string {
        return this.namespace.join("::");
    }

    namespace: string[];
}

function nestedIdentifierTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
    return (context) => {
        function visit(node: ts.Node): ts.Node {
            console.log(ts.SyntaxKind[node.kind]);

            if (ts.isLabeledStatement(node))
                console.log(node.label);

            return ts.visitEachChild(node, visit, context);
        };

        return (node) => ts.visitNode(node, visit);
    };
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
    [nestedIdentifierTransformer()],
    {
        composite: true
    }
);