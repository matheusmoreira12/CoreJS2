import { URLToken } from "./URLTokenifier.js";
import { assertParams } from "../../ValidationStandalone/index.js";

export class URLQueryParameter {
    static fromToken(token: URLToken): URLQueryParameter | null {
        if (token && token.type == "parameter")
            return new URLQueryParameter(token.key || "", token.value || "");
        else
            return null;
    }

    constructor(key: string, value: string) {
        assertParams({ key, value }, [String]);

        this.key = key;
        this.value = value;
    }

    toToken(): URLToken {
        return {
            type: "parameter",
            key: this.key,
            value: this.value
        };
    }

    key: string;
    value: string;
}
