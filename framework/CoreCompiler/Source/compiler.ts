import ts = require("typescript");

const declarationContext = {
    declarations: [
        []
    ],

    push(...names) {
        return this.declarations.push(names);
    },

    pop() {
        return this.declarations.pop();
    },

    getCurrent(): [] {
        return this.declarations[this.declarations.length - 1];
    },

    hasName(name: string): boolean {
        return this.declarations.some(c => c.includes(name));
    },
}

function* getDeclarations(node: ts.Node) {
    if (ts.isVariableDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isFunctionDeclaration(node)) {
            yield node.name;
    }
}

function transformDoubleColon(node: ts.Node){
    if (node.kind == ts.SyntaxKind.SemicolonToken)
    {
        console.log("colon!");
    }
}

function simpleTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
    return (context) => {
        const visit: ts.Visitor = (node) => {
            transformDoubleColon(node);

            declarationContext.push(...getDeclarations(node));
            let result = ts.visitEachChild(node, (child) => visit(child), context);
            declarationContext.pop();

            return result;
        };

        return (node) => ts.visitNode(node, visit);
    };
}

let input = `
    let x: int;

    export class X::Y {
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