import { Method } from "../reflection/types";
import { MethodOverrideParam } from "./method-override-param.js";

const $params = Symbol("params");
const $body = Symbol("body");

export class MethodOverride<TOverride extends Method> {
    get params(): MethodOverrideParam[]{ return this[$params]; }

    private [$params]: MethodOverrideParam[];

    get body(): Function{ return this[$body]; }

    private [$body]: Function;
}