export class URLQueryParameter {
    static fromToken(token) {
        if (!token || token.type !== "parameter")
            return null;
        return new URLQueryParameter(token.key, token.value);
    }
    constructor(key, value) {
        if (typeof key !== "string")
            throw `Invalid value for parameter "key". A value of type String was expected.`;
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        this.key = key;
        this.value = value;
    }
    toToken() {
        return {
            type: "parameter",
            key: this.key,
            value: this.value
        };
    }
}
