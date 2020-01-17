import { URLToken } from "./index.js";

export class URLPath {
    static fromToken(token: URLToken) {
        function* generateSegments(tokens: URLToken[]): Generator<string> {
            for (let token of tokens) {
                if (token.type === "segment")
                    yield token.value || "";
            }
        }

        if (!token || token.type !== "path")
            return null;

        return new URLPath(...generateSegments(token.items));
    }

    constructor(...segments: string[]) {
        if (segments === null)
            segments = [];
        if (!(segments instanceof Array))
            throw `Invalid value for parameter "segments". A value of type Array was expected.`;

        this.segments = segments;
    }

    toToken() {
        function* getItems(this: URLPath) {
            for (let i = 0; i < this.segments.length; i++) {
                yield {
                    type: "slash"
                };
                yield {
                    type: "segment",
                    value: this.segments[i]
                };
            }
        }

        const items = [...getItems.call(this)];
        return {
            type: "path",
            items
        };
    }

    collapse() {
        const resultSegments: string[] = [];
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i],
                lastSegment = this.segments[i - 1];
            switch (segment) {
                case ".":
                    break;
                case "..":
                    resultSegments.pop();
                    break;
                default:
                    resultSegments.push(segment);
                    break;
            }
        }
        return new URLPath(...resultSegments);
    }

    segments: string[];
}