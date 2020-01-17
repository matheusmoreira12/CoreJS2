import { URLToken } from "./index.js";

export class URLHostname {
    static fromToken(token: URLToken) {
        function* generateLabels(tokens: URLToken[]): Generator<string> {
            for (let token of tokens) {
                if (token.type === "label")
                    yield token.value || "";
            }
        }

        if (!token || token.type !== "hostname")
            return null;
        return new URLHostname(...generateLabels(token.items));
    }
    constructor(...labels: string[]) {
        if (!(labels instanceof Array))
            throw `Invalid value for parameter "labels". A value of type Array was expected.`;
        this.labels = labels;
    }
    toToken() {
        function* getItems(this: URLHostname) {
            for (let i = 0; i < this.labels.length; i++) {
                if (i > 0)
                    yield {
                        type: "dot"
                    };
                yield {
                    type: "label",
                    value: this.labels[i]
                };
            }
        }
        const items = [...getItems.call(this)];
        return {
            type: "hostname",
            items
        };
    }

    labels: string[];
}
