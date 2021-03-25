import { FunctionInfoBase, MemberType, Type, ParameterInfo } from "./index.js";

export class FunctionInfo extends FunctionInfoBase {
    constructor(name: string, declaringType: Type, parameters: ParameterInfo[], isStatic: boolean = false) {
        super(MemberType.Function, name, declaringType, parameters, isStatic);
    }
}