import ts = require("typescript");

let exportStatementCount = 0;

function transformModuleDeclaration(node: ts.ModuleDeclaration): ts.Node | undefined {
    const moduleName = node.name.text;
    return ts.createArrowFunction(
        [ts.createModifier(ts.SyntaxKind.AsyncKeyword)],
        undefined,
        [
            ts.createParameter([], [], undefined, "__module_context")
        ],
        undefined,
        ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken),
        ts.createBlock([])
    );
}

function moduleSystemTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
    return (context) => {
        const visit: ts.Visitor = (node) => {
            if (ts.isModuleDeclaration(node))
                return transformModuleDeclaration(node);

            return ts.visitEachChild(node, visit, context);
        };

        return (node) => ts.visitNode(node, visit);
    };
}

let input = `
let x: int;
let y, z: int;

export namespace Test__Namespace {
    export class X {
    }
}

import Test__Namespace;

function f() {
    
}
`;

console.log(input);

let result = ts.transpileModule(input, {
    compilerOptions: {
        module: ts.ModuleKind.None
    },
    transformers: {
        before: [moduleSystemTransformer()]
    },
});

console.log(result.outputText);