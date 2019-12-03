const URL_SCHEME_PATTERN = `(?<scheme>[a-z]+):\\/\\/`;
const URL_HOSTNAME_PATTERN = `(?<domain>[a-zA-Z0-9.]+)`; //The pattern for the whole domain
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
        const { protocol, domain: domainStr, port: portStr, path: pathStr, query: queryStr, hash }
            = urlRegex.exec(value).groups;
        const domain = URLDomain.parse(domainStr),
            port = (portStr === undefined ? null : Number(portStr)),
            path = (pathStr === undefined ? null : URLPath.parse(pathStr)),
            query = (queryStr === undefined ? null : URLQuery.parse(queryStr));
        return new URLData(domain, path, protocol, port, query, hash);
    }

    constructor(domain, path, protocol = null, port = null, query = null, hash = null) {
        if (protocol === null)
            protocol = DEFAULT_PROTOCOL;
        if (typeof protocol !== "string")
            throw `Invalid value for parameter "key". A value of type String was expected.`;

        if (!(domain instanceof URLDomain))
            throw `Invalid value for parameter "domain". A value of type URLDomain was expected.`;

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

        this.protocol = protocol;
        this.domain = domain;
        this.path = path;
        this.port = port;
        this.query = query;
        this.hash = hash;
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
        let memberStrs = url.split("/");
        return memberStrs.slice(0, memberStrs.length - 2).join("/");
    }
};