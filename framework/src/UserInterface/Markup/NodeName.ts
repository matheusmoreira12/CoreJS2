import { assertParams } from "../../ValidationStandalone/index.js";
import { FormatException } from "../../Standard/index.js";

//Keys for NodeName
const $name = Symbol("name");
const $prefix = Symbol("prefix");

export class NodeName extends String {
    constructor(name: string) {
        super(name);

        assertParams({ name }, [String])

        var parts = name.split(":");
        if (parts.length == 2) {
            this[$prefix] = parts[0];
            this[$name] = parts[1];
        }
        else if (parts.length == 1)
            this[$name] = parts[0];
        else
            throw new FormatException("[prefix:]name", name);
    }

    get prefix(): string | null{ return this[$prefix]; };
    private [$prefix]: string | null = null;

    get name(): string { return this[$name]; };
    private [$name]: string;
}