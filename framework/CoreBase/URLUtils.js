const RESERVED_CHARS = [..."!*'();:@&=$,/?#[]"];

const DEFAULT_PORT_HTTP = 80;
const DEFAULT_PORT_HTTPS = 443;
const DEFAULT_PROTOCOL = "http";

function isAllowedCharacter(char) {
    return char && !RESERVED_CHARS.includes(char);
}

export class URLTokenifier {
    tokenify(str) {
        function readProtocol() {
            const j = i;
            while (/[a-z]/.exec(str[i]))
                i++;
            if (str[i] === ":") {
                i++;
                if (str[i] === "/") {
                    i++;
                    if (str[i] === "/") {
                        i++;
                        return {
                            type: "protocol",
                            value: str.slice(j, i - 3)
                        };
                    }
                }
            }
            i = j;
            return null;
        }

        function readHostname() {
            function* readHostnameItems() {
                function readHostnameLabel() {
                    const j = i;
                    while (/\w/.exec(str[i]))
                        i++;
                    if (i > j)
                        return {
                            type: "label",
                            value: str.slice(j, i)
                        }
                    return null;
                }

                function readDot() {
                    if (str[i] === ".") {
                        i++;
                        return { type: "dot" };
                    }
                    return null;
                }

                function readHostnameItem() {
                    return readHostnameLabel() || readDot();
                }

                let item;
                while ((item = readHostnameItem()) !== null)
                    yield item;
            }

            const items = [...readHostnameItems()];
            if (items.length > 0)
                return {
                    type: "hostname",
                    items
                };
            return null;
        }

        function readPort() {
            const j = i;
            if (str[i] === ":") {
                const k = i;
                while (/[0-9]/.exec(str[i]))
                    i++;
                if (i > k)
                    return {
                        type: "port",
                        value: str.slice(k, i)
                    };
            }
            i = j;
            return null;
        }

        function readPath() {
            function* readPathItems() {
                function readPathItem() {
                    function readPathSegment() {
                        const j = i;
                        while (isAllowedCharacter(str[i]))
                            i++;
                        if (i > j) {
                            return {
                                type: "segment",
                                value: str.slice(j, i)
                            }
                        }
                        return null;
                    }

                    function readSlash() {
                        if (str[i] === "/") {
                            i++;
                            return { type: "slash" };
                        }
                        return null;
                    }

                    return readSlash() || readPathSegment();
                }

                let item;
                while ((item = readPathItem()) !== null)
                    yield item;
            }

            const items = [...readPathItems()];
            if (items.length > 0)
                return {
                    type: "path",
                    items
                }
            return null;
        }

        function readQuery() {
            function* readQueryItems() {
                function readAmp() {
                    if (str[i] === "&") {
                        i++;
                        return { type: "amp" };
                    }
                    return null;
                }

                function readParameter() {
                    const j = i;
                    while (isAllowedCharacter(str[i]))
                        i++;
                    const key = str.slice(j, i);
                    if (str[i] === "=") {
                        i++
                        const k = i;
                        while (isAllowedCharacter(str[i]))
                            i++;
                        const value = str.slice(k, i);
                        return {
                            type: "parameter",
                            key,
                            value
                        };
                    }
                    return null;
                }

                function readQueryItem() {
                    return readAmp() || readParameter();
                }

                let item;
                while ((item = readQueryItem()) !== null)
                    yield item;
            }

            const j = i;
            if (str[i] === "?") {
                i++;
                const items = [...readQueryItems()];
                if (items.length > 0)
                    return {
                        type: "query",
                        items
                    };
            }
            i = j;
            return null;
        }

        function readFragment() {
            const j = i;
            if (str[i] === "#") {
                i++;
                const k = i;
                while (isAllowedCharacter(str[i]))
                    i++;
                if (i > k)
                    return {
                        type: "fragment",
                        value: str.slice(k, i)
                    };
            }
            i = j;
            return null;
        }

        function* readItems() {
            const protocol = readProtocol();
            if (protocol !== null) {
                yield protocol;

                const hostname = readHostname();
                if (hostname !== null) {
                    yield hostname;

                    const port = readPort();
                    if (port !== null)
                        yield port;

                    const path = readPath();
                    if (path !== null) {
                        yield path;

                        const query = readQuery();
                        yield query;

                        const fragment = readFragment();
                        yield fragment;
                    }
                }
            }
        }

        let i = 0;

        const items = [...readItems()];
        return {
            type: "url",
            items
        };
    }
}

class URLPath {
    static fromToken(token) {
        if (!token || token.type !== "url")
            return null;
    }

    constructor(segments) {
        if (segments === null)
            segments = [];
        if (!(segments instanceof Array))
            throw `Invalid value for parameter "segments". A value of type Array was expected.`;

        this.segments = segments;
    }

    toString() {
        return this.segments.join("/");
    }
}

class URLQueryParameter {
    static fromToken(token) {
        if (!token || token.type !== "parameter")
            return null;

        return new URLQueryParameter(item.key, item.value);
    }

    constructor(key, value) {
        if (typeof key !== "string")
            throw `Invalid value for parameter "key". A value of type String was expected.`;
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        this.key = key;
        this.value = value;
    }

    toString() {
        return `${this.key}=${this.value}`;
    }
}

class URLQuery {
    static fromToken(token) {
        function* getParameters(tokens) {
            for (let token of tokens) {
                if (token.type === "parameter")
                    yield URLQueryParameter.fromToken(token);
            }
        }

        if (!token || token.type !== "query")
            return null;

        const parameters = [...getParameters(token.items)]
        return new URLQuery(parameters);
    }

    constructor(parameters = null) {
        if (parameters === null)
            parameters = [];
        if (!(parameters instanceof Array))
            throw `Invalid value for parameter "parameters". A value of type Array was expected.`;

        this.parameters = parameters;
    }

    toString() {
        return this.parameters.map(p => p.toString()).join("&");
    }
}

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
        return new URLHostname(labels)
    }

    constructor(labels) {
        if (!(labels instanceof Array))
            throw `Invalid value for parameter "labels". A value of type Array was expected.`;
        this.labels = labels;
    }

    toString() {
        return this.labels.join(".");
    }
}

function getDefaultPort(protocol) {
    switch (protocol) {
        case "http":
            return DEFAULT_PORT_HTTP;
        case "https":
            return DEFAULT_PORT_HTTPS;
    }
    throw `Invalid protocol "${protocol}".`;
}

export class URLData {
    static fromToken(token) {
        if (!token || token.type !== "url")
            return null;

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

        return new URLData(hostname, path, protocol, port, query, fragment)
    }

    static parse(value) {
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        const token = new URLTokenifier().tokenify(value);
        return this.fromToken(token);
    }

    constructor(hostname, path, protocol = null, port = null, query = null, fragment = null) {
        if (protocol === null)
            protocol = DEFAULT_PROTOCOL;
        if (typeof protocol !== "string")
            throw `Invalid value for parameter "key". A value of type String was expected.`;

        if (!(hostname instanceof URLHostname))
            throw `Invalid value for parameter "hostname". A value of type URLHostname was expected.`;

        if (!(path instanceof URLPath))
            throw `Invalid value for parameter "path". A value of type URLPath was expected.`;

        if (port === null)
            port = getDefaultPort(protocol);
        if (typeof port !== "number")
            throw `Invalid value for parameter "port". A value of type String was expected.`;

        if (query === null)
            query = new URLQuery();
        if (!(query instanceof URLQuery))
            throw `Invalid value for parameter "query". A value of type URLQuery was expected.`;

        if (fragment === null)
            fragment = "";
        if (typeof fragment !== "string")
            throw `Invalid value for parameter "fragment". A value of type String was expected.`;

        this.protocol = protocol;
        this.hostname = hostname;
        this.path = path;
        this.port = port;
        this.query = query;
        this.fragment = fragment;
    }

    toString() {
        const hostnameStr = this.hostname.toString(),
            portStr = this.port.toString(),
            pathStr = this.path.toString(),
            queryStr = this.query.toString();
        return `${this.protocol}://${hostnameStr}:${portStr}${pathStr}?${queryStr}#${this.fragment}`;
    }
}

export const URLUtils = {
    levelUp(url) {
        let memberStrs = url.split("/");
        return memberStrs.slice(0, memberStrs.length - 2).join("/");
    }
};