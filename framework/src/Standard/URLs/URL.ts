import { URLQuery, URLHostname, URLToken, URLPath, URLTokenifier } from "./index";
import { assertParams } from "../../Validation/index";

export class URL {
    static fromToken(token: URLToken): URL | null {
        if (token && token.type == "url" && token.items) {
            let protocol = null,
                hostname = null,
                port = null,
                path = null,
                query = null,
                fragment = null;

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

            if (hostname && path)
                return new URL(hostname, path, protocol, port, query, fragment);
            else
                return null;
        }
        else
            return null;
    }

    static parse(value: string) {
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        const token = new URLTokenifier().tokenify(value);
        return this.fromToken(token);
    }

    constructor(hostname: URLHostname, path: URLPath, protocol: string | null = null, port: number | null = null, query: URLQuery | null = null, fragment: string | null = null) {
        assertParams({ hostname }, String);
        assertParams({ path }, URLPath);
        assertParams({ protocol }, String, null);
        assertParams({ port }, Number, null);
        assertParams({ query }, URLQuery, null);
        assertParams({ fragment }, String, null);

        this.protocol = protocol;
        this.hostname = hostname;
        this.path = path;
        this.port = port;
        this.query = query;
        this.fragment = fragment;
    }

    toToken(): URLToken {
        function* generateItems(this: URL) {
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

        return {
            type: "url",
            items: [...generateItems.call(this)]
        };
    }

    toString(): string | null {
        const token = this.toToken(),
            tokenifier = new URLTokenifier();
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
