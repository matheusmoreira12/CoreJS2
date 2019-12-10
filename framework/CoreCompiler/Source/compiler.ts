import ts = require("typescript");

function simpleTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
    return (context) => {
        const visitToken: ts.Visitor = (token) => {
            console.log(ts.SyntaxKind[token.kind]);

            const siblings = token.parent.getChildren();
            const lastToken = siblings[token.pos - 1];

            if (lastToken.kind == ts.SyntaxKind.ColonToken) {
                if (token.kind == ts.SyntaxKind.ColonToken)
                return undefined;
            }

            return token;
        }

        const visit: ts.Visitor = (node) => {
            return ts.visitEachChild(node, (child) => visit(child), context, undefined, (token) => visitToken(token));
        };

        return (node) => ts.visitNode(node, visit);
    };
}

let input = `
    let x: int;
    let y, z: int;

    export namespace Test::Namespace {
        export class X {
        }
    }

    function f() {
        
    }
`;

let result = ts.transpileModule(input, {
    compilerOptions: {
        module: ts.ModuleKind.ESNext,
    },
    transformers: {
        before: [simpleTransformer()]
    }
});

console.log(result);