type Token = {
    type: string,
    key?: string,
    value?: string,
    items?: Token[],
}

export class FunctionTokenifier {
    tokenify(content: string): Token {
        return {
            type: "function"
        }
    }
}