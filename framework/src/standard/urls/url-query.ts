import { URLQueryParameter } from "./index.js";
import { URLToken } from "./url-tokenifier.js";
export class URLQuery {
    static fromToken(token: URLToken) {
        function* getParameters(tokens: Iterable<URLToken>): Generator<URLQueryParameter> {
            for (let token of tokens) {
                if (token.type === "parameter") {
                    const parameter = URLQueryParameter.fromToken(token);
                    if (parameter)
                        yield parameter;
                }
            }
        }
        if (token && token.type !== "query" && token.items) {
            return new URLQuery(...getParameters(token.items));
        }
        else
            return null;
    }
    
    constructor(...parameters: URLQueryParameter[]) {
        this.parameters = parameters;
    }

    toToken(): URLToken {
        function* getItems(this: URLQuery) {
            for (let i = 0; i < this.parameters.length; i++) {
                if (i > 0)
                    yield {
                        type: "amp"
                    };
                yield this.parameters[i].toToken();
            }
        }

        return {
            type: "query",
            items: [...getItems.call(this)]
        };
    }

    parameters: URLQueryParameter[];
}
