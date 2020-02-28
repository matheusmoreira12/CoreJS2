import { FunctionParameterModel } from "./FunctionParameterModel";
import { assertParams, assertEachParams } from "../../../Validation/index";

const $name = Symbol();
const $parameters = Symbol();

export class FunctionModel {
    constructor(name: string, parameters: FunctionParameterModel[]) {
        assertParams({ name }, String);
        assertEachParams({ parameters }, Array, FunctionParameterModel);

        this[$name] = name;
        this[$parameters] = parameters;
    }

    get name(): string { return this[$name]; }
    private [$name]: string;

    get parameters(): FunctionParameterModel[] { return this[$parameters]; }
    private [$parameters]: FunctionParameterModel[];
}