import { Type } from "../Type";

const $name = Symbol();
const $type = Symbol();

export class FunctionParameterModel {
    constructor(name: string, type: Type) {
        this[$name] = name;
        this[$type] = type;
    }

    get name(): string { return this[$name]; }
    private [$name]: string;

    get type(): Type { return this[$type]; }
    private [$type]: Type;
}