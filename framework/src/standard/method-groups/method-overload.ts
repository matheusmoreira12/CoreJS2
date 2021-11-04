import { Method } from "../reflection/types";
import { MethodOverloadParam } from "./method-overload-param.js";

const $params = Symbol("params");
const $body = Symbol("body");

export class MethodOverload<TOverload extends Method> {
    get params(): MethodOverloadParam[]{ return this[$params]; }

    private [$params]: MethodOverloadParam[];

    get body(): Function{ return this[$body]; }

    private [$body]: Function;
}