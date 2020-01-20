import { URLQuery, URLHostname, URLToken, URLPath, URLTokenifier } from "./index.js";

export class URL {
    static fromToken(token: URLToken): URL | null {
        if (!token || token.type !== "url")
            return null;
        let protocol = null, hostname = null, port = null, path = null, query = null, fragment = null;

        if (!token.items)
            return null;

        for (let item of token.items) {
            switch (item.type) {
                case "protocol":
                    protocol = item.value;
                    break;
                case "hostname":
                    hostname = URLHostname.fromToken(item);
                    break;
                case "port":
                    port = Number(item.value);
                    break;
                case "path":
                    path = URLPath.fromToken(item);
                    break;
                case "query":
                    query = URLQuery.fromToken(item);
                    break;
                case "fragment":
                    fragment = item.value;
                    break;
            }
        }

        if (!hostname)
            return null;
        if (!path)
            return null;

        return new URL(hostname, path, protocol, port, query, fragment);
    }
    static parse(value: string) {
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        const token = new URLTokenifier().tokenify(value);
        return this.fromToken(token);
    }
    constructor(hostname: URLHostname, path: URLPath, protocol?: string | null, port?: number | null, query?: URLQuery | null, fragment?: string | null) {
        if (!(hostname instanceof URLHostname))
            throw `Invalid value for parameter "hostname". A value of type URLHostname was expected.`;
        if (!(path instanceof URLPath))
            throw `Invalid value for parameter "path". A value of type URLPath was expected.`;

        if (protocol === undefined)
            protocol = null;
        if (port === undefined)
            port = null;
        if (query === undefined)
            query = null;
        if (fragment === undefined)
            fragment = null;

        if (protocol !== null && typeof protocol !== "string")
            throw `Invalid value for parameter "protocol". A value of type String was expected.`;
        if (port !== null && typeof port !== "number")
            throw `Invalid value for parameter "port". A value of type String was expected.`;
        if (query !== null && !(query instanceof URLQuery))
            throw `Invalid value for parameter "query". A value of type URLQuery was expected.`;
        if (fragment !== null && typeof fragment !== "string")
            throw `Invalid value for parameter "fragment". A value of type String was expected.`;

        this.protocol = protocol;
        this.hostname = hostname;
        this.path = path;
        this.port = port;
        this.query = query;
        this.fragment = fragment;
    }

    toToken(): URLToken {
        function* getItems(this: URL) {
            if (this.protocol)
                yield {
                    type: "protocol",
                    value: this.protocol
                };
            yield this.hostname.toToken();
            if (this.port)
                yield {
                    type: "port",
                    value: String(this.port)
                };
            yield this.path.toToken();
            if (this.query)
                yield this.query.toToken();
            if (this.fragment)
                yield {
                    type: "fragment",
                    value: this.fragment
                };
        }
        const items = [...getItems.call(this)];
        return {
            type: "url",
            items
        };
    }

    toString(): string | null {
        const token = this.toToken(), tokenifier = new URLTokenifier();
        return tokenifier.detokenify(token);
    }

    collapse() {
        return new URL(this.hostname, this.path.collapse(), this.protocol, this.port, this.query, this.fragment);
    }

    protocol: string | null;
    hostname: URLHostname;
    path: URLPath;
    port: number | null;
    query: URLQuery | null;
    fragment: string | null;
}
