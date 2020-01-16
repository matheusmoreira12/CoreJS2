export class URLHostname {
    static fromToken(token) {
        function* getLabels(tokens) {
            for (let token of tokens) {
                if (token.type === "label")
                    yield token.value;
            }
        }
        if (!token || token.type !== "hostname")
            return null;
        const labels = [...getLabels(token.items)];
        return new URLHostname(labels);
    }
    constructor(labels) {
        if (!(labels instanceof Array))
            throw `Invalid value for parameter "labels". A value of type Array was expected.`;
        this.labels = labels;
    }
    toToken() {
        function* getItems() {
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
}
