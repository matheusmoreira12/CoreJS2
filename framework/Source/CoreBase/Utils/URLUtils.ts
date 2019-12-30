import StringUtils from "./StringUtils";

const GEN_DELIMS = [":", "/", "?", "#", "[", "]", "@"];
const SUB_DELIMS = ["!", "$", "&", "’", "(", ")", "*", "+", ",", ";", "="];
const RESERVED_CHARS = [..."!*'();:@&=$+,/?#[]"];

function isAllowedChar(char) {
    return char && RESERVED_CHARS.indexOf(char) == -1;
}

export class URLTokenifier {
    tokenify(str) {
        function readProtocol() {
            const j = i;
            while (StringUtils.isLowerCaseLetter(str[i]))
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
                    while (StringUtils.isWordChar(str[i]))
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
                i++;
                const k = i;
                while (StringUtils.isNumericChar(str[i]))
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
                        while (isAllowedChar(str[i]))
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
                    while (isAllowedChar(str[i]))
                        i++;
                    const key = str.slice(j, i);
                    if (str[i] === "=") {
                        i++
                        const k = i;
                        while (isAllowedChar(str[i]))
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
                while (isAllowedChar(str[i]))
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
            if (protocol !== null)
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
                    if (query !== null)
                        yield query;

                    const fragment = readFragment();
                    if (fragment !== null)
                        yield fragment;
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

    detokenify(token) {
        function writeProtocol(token) {
            str += `${token.value}://`;
        }

        function writeHostname(token) {
            function writeLabel(token) {
                str += token.value;
            }

            for (let item of token.items)
                switch (item.type) {
                    case "label":
                        writeLabel(item);
                        break;
                    case "dot":
                        str += ".";
                        break;
                }
        }

        function writePort(token) {
            str += `:${token.value}`;
        }

        function writePath(token) {
            function writeSegment(token) {
                str += token.value;
            }

            for (let item of token.items)
                switch (item.type) {
                    case "segment":
                        writeSegment(item);
                        break;
                    case "slash":
                        str += "/";
                        break;
                }
        }

        function writeQuery(token) {
            function writeParameter(token) {
                str += `${token.key}=${token.value}`;
            }

            str += "?";

            for (let item of token.items)
                switch (item.type) {
                    case "parameter":
                        writeParameter(item);
                        break;
                    case "amp":
                        str += "&";
                        break;
                }
        }

        function writeFragment(token) {
            str += `#${token.value}`;
        }

        if (!token || token.type !== "url")
            return null;

        let str = "";
        for (let item of token.items) {
            switch (item.type) {
                case "protocol":
                    writeProtocol(item);
                    break;
                case "hostname":
                    writeHostname(item);
                    break;
                case "port":
                    writePort(item)
                    break;
                case "path":
                    writePath(item)
                    break;
                case "query":
                    writeQuery(item)
                    break;
                case "fragment":
                    writeFragment(item)
                    break;
            }
        }
        return str;
    }
}

class URLPath {
    static fromToken(token) {
        function* getSegments(tokens) {
            for (let token of tokens) {
                if (token.type === "segment")
                    yield token.value;
            }
        }

        if (!token || token.type !== "path")
            return null;

        const segments = [...getSegments(token.items)];
        return new URLPath(segments);
    }

    constructor(segments) {
        if (segments === null)
            segments = [];
        if (!(segments instanceof Array))
            throw `Invalid value for parameter "segments". A value of type Array was expected.`;

        this.segments = segments;
    }

    toToken() {
        function* getItems() {
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
        const resultSegments = [];
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
        return new URLPath(resultSegments);
    }
}


class URLQueryParameter {
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
        }
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
        }
    }
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
        if (!(hostname instanceof URLHostname))
            throw `Invalid value for parameter "hostname". A value of type URLHostname was expected.`;
        if (!(path instanceof URLPath))
            throw `Invalid value for parameter "path". A value of type URLPath was expected.`;
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

    toToken() {
        function* getItems() {
            if (this.protocol)
                yield {
                    type: "protocol",
                    value: this.protocol
                };

            yield this.hostname.toToken();

            if (this.port)
                yield {
                    type: "port",
                    value: this.port
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
        }
    }

    toString() {
        const token = this.toToken(),
            tokenifier = new URLTokenifier();
        return tokenifier.detokenify(token);
    }

    collapse() {
        return new URLData(this.hostname, this.path.collapse(), this.protocol, this.port, this.query, this.fragment);
    }
}

export const URLUtils = {
    levelUp(url) {
        return URLData.parse(url + "/../").collapse().toString();
    }
};