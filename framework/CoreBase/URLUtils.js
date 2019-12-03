const URL_SCHEME_PATTERN = `(?<scheme>[a-z]+):\\/\\/`;
const URL_HOSTNAME_PATTERN = `(?<hostkey>[a-zA-Z0-9.]+)`; //The pattern for the whole domain
const URL_PORT_PATTERN = ":(?<port>[0-9]+)";
const URL_ALLOWED_CHARS = "a-zA-Z0-9$\\-_.+!*'(),";
const URL_PATH_PATTERN = `(?<path>[${URL_ALLOWED_CHARS}\\/]+)`; //The pattern for the whole path
const URL_QUERY_PATTERN = `\\?(?<query>[${URL_ALLOWED_CHARS}&=]+)`; //The pattern for the 
//whole query
const URL_FRAGMENT_PATTERN = `#(?<hash>[${URL_ALLOWED_CHARS}]+)`; //The pattern for the hash
//string
const URL_PATTERN = `^${URL_SCHEME_PATTERN}${URL_HOSTNAME_PATTERN}(${URL_PORT_PATTERN})?${URL_PATH_PATTERN}?(${URL_QUERY_PATTERN})` +
    `?(${URL_FRAGMENT_PATTERN})?$`; //The pattern for the whole URL

const DEFAULT_PORT_HTTP = 80;
const DEFAULT_PORT_HTTPS = 443;
const DEFAULT_PROTOCOL = "http";

class URLPath {
    constructor(segments) {
        if (!(segments instanceof Array))
            throw `Invalid value for parameter "segments". A value of type Array was expected.`;
        this.segments = segments;
    }
}

class URLQueryParameter {
    static parse(value) {
        const members = value.split("=");
        if (members != 2)
            return null;
        return new URLQueryParameter(members[0], members[1]);
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
        const members = value.split("&");
        return members.map(m => URLQueryParameter.parse(m));
    }

    constructor(parameters) {
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
        const urlRegex = new RegExp(URL_PATTERN);
        const { protocol, domnain: domainStr, port: portStr, path: pathStr, query: queryStr, hash }
            = urlRegex.exec(value);
        const domain = URLDomain.parse(domainStr),
            port = Number(portStr),
            path = URLPath.parse(pathStr),
            query = URLQuery.parse(queryStr);
        return new URLData(protocol, domain, port, path, query);
    }

    constructor(domain, path, protocol = null, port = null, query = null, hash = null) {
        if (protocol === null)
            protocol = DEFAULT_PROTOCOL;
        if (typeof protocol !== "string")
            throw `Invalid value for parameter "key". A value of type String was expected.`;

        if (typeof domain !== "string")
            throw `Invalid value for parameter "domain". A value of type String was expected.`;

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

        if (hash === null)
            hash = "";
        if (typeof hash !== "string")
            throw `Invalid value for parameter "hash". A value of type String was expected.`;
    }

    toString() {
        const domainStr = this.domain.toString(),
            portStr = this.port.toString(),
            pathStr = this.path.toString(),
            queryStr = this.query.toString();
        return `${this.protocol}://${domainStr}:${portStr}${pathStr}?${queryStr}#${this.hash}`;
    }
}

export const URLUtils = {
    levelUp(url) {
        let members = url.split("/");
        return members.slice(0, members.length - 2).join("/");
    }
};