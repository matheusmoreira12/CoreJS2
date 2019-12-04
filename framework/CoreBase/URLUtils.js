const RESERVED_CHARS = "!*'();:@&=+$,/?#[]";
const URL_PATTERN = `(?<scheme>[a-z]+):\\/\\/(?<hostname>[\\w.]+)(?<port>:[0-9]+)?(?<path>([^${RESERVED_CHARS}]|\\/)+)(?<query>\\?([^${RESERVED_CHARS}]|[&=])+)?(?<fragment>#([^${RESERVED_CHARS}])+)?`; //The pattern for the whole URL

const DEFAULT_PORT_HTTP = 80;
const DEFAULT_PORT_HTTPS = 443;
const DEFAULT_PROTOCOL = "http";

function read(str) {
    function readItem() {
        return readScheme() || readHostname() || readPort() || readPath() || readQuery() || readFragment();
    }

    function readScheme() {
        const j = i;
        while (/[a-z]/.exec(str[k]))
            i++;
        if (str[i] === ":") {
            i++;
            if (str[i] === "/") {
                i++;
                if (str[i] === "/") {
                    i++;
                    return result = {
                        type: "scheme",
                        value: str.slice(j, i)
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
                const j = i;
                if (str[i] === ".") {
                    i++;
                    return {
                        type: "dot"
                    };
                }
                i = j;
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
        function readPathItems() {
            function readPathItem() {
                function readPathSegment() {
                    const j = i;
                    while (!/[!*'();:@&=+$,/?#\[\]]/.exec(str[i]))
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
                    const j = i;
                    if (str[i] === "/") {
                        i++;
                        return {
                            type: "slash"
                        };
                    }
                    i = j;
                    return null;
                }

                return readPathSegment() || readSlash();
            }

            let item;
            while ((item = readPathItem()) !== null)
                yield item;
        }

        const items = [...readPathItems];
        if (items.length > 0)
            return {
                type: "path",
                items
            }
        return null;
    }

    function readQuery() {
        const j = i;
    }

    function readFragment() {
        const j = i;
        if (str[i] === "#") {
            i++;
            const k = i;
            while (!/[!*'();:@&=+$,/?#\[\]]/.exec(str[i]))
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

    function* readAll() {
        let item;
        while (i < str.length && (item = readItem()) !== null)
            yield item;
    }

    let i = 0;
    return [...readAll()];
}

class URLPath {
    static parse(value) {
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        const segments = value.split("/");
        return new URLPath(segments);
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
    static parse(value) {
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        const memberStrs = value.split("=");
        if (memberStrs != 2)
            return null;
        return new URLQueryParameter(memberStrs[0], memberStrs[1]);
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
    static parse(value) {
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        const memberStrs = value.split("&"),
            parameters = memberStrs.map(s => URLQueryParameter.parse(s));
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

export class URLDomain {
    static parse(value) {
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        const labels = value.split(".");
        return new URLDomain(labels);
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
    static parse(value) {
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        const urlRegex = new RegExp(URL_PATTERN);
        const { protocol, hostname: hostnameStr, port: portStr, path: pathStr, query: queryStr, fragment }
            = urlRegex.exec(value).groups;
        const hostname = URLDomain.parse(hostnameStr),
            port = (portStr === undefined ? null : Number(portStr)),
            path = (pathStr === undefined ? null : URLPath.parse(pathStr)),
            query = (queryStr === undefined ? null : URLQuery.parse(queryStr));
        return new URLData(hostname, path, protocol, port, query, fragment);
    }

    constructor(hostname, path, protocol = null, port = null, query = null, fragment = null) {
        if (protocol === null)
            protocol = DEFAULT_PROTOCOL;
        if (typeof protocol !== "string")
            throw `Invalid value for parameter "key". A value of type String was expected.`;

        if (!(hostname instanceof URLDomain))
            throw `Invalid value for parameter "hostname". A value of type URLDomain was expected.`;

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