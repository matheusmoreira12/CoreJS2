const URL_SCHEME_PATTERN = `(?<scheme>[a-z]+:)\\/\\/`;
const URL_HOSTNAME_PATTERN = `(?<hostname>[a-zA-Z0-9.]+)`; //The pattern for the whole domain
const URL_PORT_PATTERN = ":(?<port>[0-9]+)";
const URL_ALLOWED_CHARS = "a-zA-Z0-9$\\-_.+!*'(),";
const URL_PATH_PATTERN = `(?<path>[${URL_ALLOWED_CHARS}\\/]+)`; //The pattern for the whole path
const URL_QUERY_PATTERN = `(?<queryString>\\?[${URL_ALLOWED_CHARS}&=]+)`; //The pattern for the 
//whole query
const URL_FRAGMENT_PATTERN = `(?<hash>#[${URL_ALLOWED_CHARS}]+)`; //The pattern for the hash
//string
const URL_PATTERN = `^${URL_SCHEME_PATTERN}${URL_HOSTNAME_PATTERN}(${URL_PORT_PATTERN})?${URL_PATH_PATTERN}?(${URL_QUERY_PATTERN})` +
    `?(${URL_FRAGMENT_PATTERN})?$`; //The pattern for the whole URL

class URLPath {
    constructor(segments) {
        if (!(segments instanceof Array))
            throw `Invalid value for parameter "segments". A value of type Array was expected.`;
        this.segments = segments;
    }
}

class URLQueryParameter {
    constructor(name, value) {
        if (typeof name !== "string")
            throw `Invalid value for parameter "name". A value of type String was expected.`;
        if (typeof value !== "string")
            throw `Invalid value for parameter "value". A value of type String was expected.`;
        this.name = name;
        this.value = value;
    }
}

class URLQuery {
    constructor(parameters) {
        if (!(parameters instanceof Array))
            throw `Invalid value for parameter "parameters". A value of type Array was expected.`;
        this.parameters = parameters;
    }
}

export class URLDomain {

}

export class URLData {
    constructor(protocol, domain, path, port = null, query = null, hash = null) {
        if (typeof protocol !== "string")
            throw `Invalid value for parameter "name". A value of type String was expected.`;
        if (typeof domain !== "string")
            throw `Invalid value for parameter "domain". A value of type String was expected.`;
        if (!(path instanceof URLPath))
            throw `Invalid value for parameter "path". A value of type URLPath was expected.`;
        if (port !== null && (typeof port !== "number"))
            throw `Invalid value for parameter "port". A value of type String was expected.`;
        if (query !== null && !(query instanceof URLQuery))
            throw `Invalid value for parameter "query". A value of type URLQuery was expected.`;
        if (hash !== null && (typeof hash !== "string"))
            throw `Invalid value for parameter "hash". A value of type String was expected.`;
    }
}

export const URLUtils = {
    levelUp(url) {
        let members = url.split("/");
        return members.slice(0, members.length - 2).join("/");
    }
};