import { Method } from "../reflection/index.js";
import { MethodOverloadParam } from "./method-overload-param.js";

const $params = Symbol("params");
const $body = Symbol("body");

export class MethodOverload<TParams extends MethodOverloadParam[], TBody extends Method<any[], any, any>> {
    get params(): MethodOverloadParam[]{ return this[$params]; }

    private [$params]: MethodOverloadParam[];

    get body(): Function{ return this[$body]; }

    private [$body]: Function;
}