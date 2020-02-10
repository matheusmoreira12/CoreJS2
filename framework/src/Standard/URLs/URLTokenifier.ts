import { StringUtils } from "../../CoreBase/Utils/index";

export type URLToken = {
    type: string,
    key?: string,
    value?: string,
    items?: URLToken[]
};

const RESERVED_CHARS = [..."!*'();:@&=$+,/?#[]"];

function isAllowedChar(char: string) {
    return char && RESERVED_CHARS.indexOf(char) == -1;
}

export class URLTokenifier {
    tokenify(str: string): URLToken {
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

        function readHostname(): URLToken | null {
            function* readHostnameItems(): Generator<URLToken> {
                function readHostnameLabel(): URLToken | null {
                    const j = i;
                    while (StringUtils.isWordChar(str[i]))
                        i++;
                    if (i > j)
                        return {
                            type: "label",
                            value: str.slice(j, i)
                        };
                    return null;
                }

                function readDot(): URLToken | null {
                    if (str[i] === ".") {
                        i++;
                        return { type: "dot" };
                    }
                    return null;
                }

                function readHostnameItem(): URLToken | null {
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

        function readPort(): URLToken | null {
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

        function readPath(): URLToken | null {
            function* readPathItems(): Generator<URLToken> {
                function readPathItem(): URLToken | null {
                    function readPathSegment() {
                        const j = i;
                        while (isAllowedChar(str[i]))
                            i++;
                        if (i > j) {
                            return {
                                type: "segment",
                                value: str.slice(j, i)
                            };
                        }
                        return null;
                    }

                    function readSlash(): URLToken | null {
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
                };
            return null;
        }

        function readQuery(): URLToken | null {
            function* readQueryItems(): Generator<URLToken> {
                function readAmp() {
                    if (str[i] === "&") {
                        i++;
                        return { type: "amp" };
                    }
                    return null;
                }

                function readParameter(): URLToken | null {
                    const j = i;
                    while (isAllowedChar(str[i]))
                        i++;
                    const key = str.slice(j, i);
                    if (str[i] === "=") {
                        i++;
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

                function readQueryItem(): URLToken | null {
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

        function readFragment(): URLToken | null {
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

        function* readItems(): Generator<URLToken> {
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

    detokenify(token: URLToken): string | null {
        function writeProtocol(token: URLToken) {
            str += `${token.value}://`;
        }

        function writeHostname(token: URLToken) {
            function writeLabel(token: URLToken) {
                str += token.value;
            }

            if (!token.items)
                return;

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

        function writePort(token: URLToken) {
            str += `:${token.value}`;
        }

        function writePath(token: URLToken) {
            function writeSegment(token: URLToken) {
                str += token.value;
            }

            if (!token.items)
                return;

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

        function writeQuery(token: URLToken) {
            function writeParameter(token: URLToken) {
                str += `${token.key}=${token.value}`;
            }

            str += "?";

            if (!token.items)
                return;

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

        function writeFragment(token: URLToken) {
            str += `#${token.value}`;
        }

        if (!token || token.type !== "url")
            return null;

        let str = "";

        if (!token.items)
            return null;

        for (let item of token.items) {
            switch (item.type) {
                case "protocol":
                    writeProtocol(item);
                    break;
                case "hostname":
                    writeHostname(item);
                    break;
                case "port":
                    writePort(item);
                    break;
                case "path":
                    writePath(item);
                    break;
                case "query":
                    writeQuery(item);
                    break;
                case "fragment":
                    writeFragment(item);
                    break;
            }
        }
        return str;
    }
}