import { URLQueryParameter } from "./index.js";
export class URLQuery {
    static fromToken(token) {
        function* getParameters(tokens) {
            for (let token of tokens) {
                if (token.type === "parameter")
                    yield URLQueryParameter.fromToken(token);
            }
        }
        if (!token || token.type !== "query")
            return null;
        const parameters = [...getParameters(token.items)];
        return new URLQuery(parameters);
    }
    constructor(parameters = null) {
        if (parameters === null)
            parameters = [];
        if (!(parameters instanceof Array))
            throw `Invalid value for parameter "parameters". A value of type Array was expected.`;
        this.parameters = parameters;
    }
    toToken() {
        function* getItems() {
            for (let i = 0; i < this.parameters.length; i++) {
                if (i > 0)
                    yield {
                        type: "amp"
                    };
                yield this.parameters[i].toToken();
            }
        }
        const items = [...getItems.call(this)];
        return {
            type: "query",
            items
        };
    }
}
